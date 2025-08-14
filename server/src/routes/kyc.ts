import express, { Response, Request, NextFunction } from 'express';
import type * as ExpressNS from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { AuthMiddleware } from '../middleware/auth';
import { AuthRequest } from '../types';
import { db } from '../config/db';
import { logger, logAudit } from '../utils/logger';
import { notificationService } from '../services/notificationService';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_PATH || 'uploads/kyc';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const userId = (req as AuthRequest).user?.id;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${userId}_${timestamp}_${file.fieldname}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') // 5MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,pdf').split(',');
    const ext = path.extname(file.originalname).toLowerCase().slice(1);

    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type .${ext} not allowed. Allowed types: ${allowedTypes.join(', ')}`));
    }
  }
});

// Optional S3 client (Cloudflare R2 / DO Spaces)
const s3Enabled = !!(process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY);
let s3: S3Client | null = null;
if (s3Enabled) {
  s3 = new S3Client({
    region: process.env.S3_REGION || 'auto',
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
    },
  });
}

// Apply authentication middleware to all routes
router.use((req: Request, res: Response, next: NextFunction) => AuthMiddleware.verifyToken(req as any, res, next));

// Submit KYC application with documents
router.post('/submit', upload.fields([
  { name: 'document_primaryId', maxCount: 1 },
  { name: 'document_proofOfAddress', maxCount: 1 },
  { name: 'document_incomeProof', maxCount: 1 },
  { name: 'document_bankStatement', maxCount: 1 },
  { name: 'document_selfie', maxCount: 1 }
]), [
  body('personal_firstName').notEmpty().withMessage('First name is required'),
  body('personal_lastName').notEmpty().withMessage('Last name is required'),
  body('personal_dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('personal_nationality').notEmpty().withMessage('Nationality is required'),
  body('address_street').notEmpty().withMessage('Street address is required'),
  body('address_city').notEmpty().withMessage('City is required'),
  body('address_state').notEmpty().withMessage('State is required'),
  body('address_country').notEmpty().withMessage('Country is required'),
  body('employment_status').notEmpty().withMessage('Employment status is required'),
  body('employment_monthlyIncome').isFloat({ min: 0 }).withMessage('Valid monthly income is required'),
  body('agreement_terms').equals('true').withMessage('Terms and conditions must be accepted'),
  body('agreement_privacy').equals('true').withMessage('Privacy policy must be accepted')
], async (req: Request, res: Response): Promise<void> => {
  try {
    const reqA = req as unknown as AuthRequest & { files?: { [fieldname: string]: any[] } };
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const user = reqA.user!;
    const files = (reqA.files || {}) as { [fieldname: string]: any[] };

    // Check if user already has a pending or approved KYC
    const existingKyc = await db('kyc_applications').where({ user_id: user.id }).first();
    if (existingKyc && ['pending', 'approved'].includes(existingKyc.status)) {
      res.status(400).json({
        success: false,
        message: 'KYC application already exists'
      });
      return;
    }

    // Create KYC application record
    const kycId = uuidv4();
    const kycData = {
      id: kycId,
      user_id: user.id,
      status: 'pending',
      personal_info: {
        firstName: req.body.personal_firstName,
        lastName: req.body.personal_lastName,
        dateOfBirth: req.body.personal_dateOfBirth,
        nationality: req.body.personal_nationality,
        gender: req.body.personal_gender,
        maritalStatus: req.body.personal_maritalStatus
      },
      address_info: {
        street: req.body.address_street,
        city: req.body.address_city,
        state: req.body.address_state,
        country: req.body.address_country,
        postalCode: req.body.address_postalCode
      },
      employment_info: {
        status: req.body.employment_status,
        employer: req.body.employment_employer,
        position: req.body.employment_position,
        monthlyIncome: parseFloat(req.body.employment_monthlyIncome),
        workAddress: req.body.employment_workAddress
      },
      submitted_at: new Date()
    };

    await db('kyc_applications').insert(kycData);

    // Process uploaded documents
    const documentTypes = ['primaryId', 'proofOfAddress', 'incomeProof', 'bankStatement', 'selfie'] as const;
    const uploadedDocuments: string[] = [];

    for (const docType of documentTypes) {
      const fieldName = `document_${docType}`;
      if (files[fieldName] && files[fieldName][0]) {
        const file = files[fieldName][0];
        const documentId = uuidv4();

        // If S3 is enabled, upload file to bucket and replace file_path with S3 key/url
        let filePathForStorage: string;
        if (s3Enabled && s3) {
          const fileStream = fs.createReadStream(file.path);
          const key = `kyc/${user.id}/${documentId}_${path.basename(file.path)}`;
          try {
            await s3.send(new PutObjectCommand({
              Bucket: process.env.S3_BUCKET!,
              Key: key,
              Body: fileStream,
              ContentType: file.mimetype,
            }));
            // We will store the S3 key; actual download can be presigned
            filePathForStorage = key;
          } catch (err) {
            logger.error('S3 upload failed', err);
            filePathForStorage = file.path; // fallback to local path
          } finally {
            try { fs.unlinkSync(file.path); } catch {}
          }
        } else {
          filePathForStorage = file.path;
        }

        const documentData = {
          id: documentId,
          user_id: user.id,
          kyc_application_id: kycId,
          document_type: docType,
          file_path: filePathForStorage,
          file_name: file.originalname,
          file_size: file.size,
          mime_type: file.mimetype,
          verification_status: 'pending'
        };

        await db('kyc_documents').insert(documentData);
        uploadedDocuments.push(docType);
      }
    }

    // Update user KYC status
    await db('users').where({ id: user.id }).update({
      kyc_status: 'in_progress',
      updated_at: new Date()
    });

    // Log audit trail
    logAudit('KYC_APPLICATION_SUBMITTED', user.id, 'kyc', {
      kycId,
      documentsUploaded: uploadedDocuments
    });

    // Send notification to user
    await notificationService.sendNotification({
      userId: user.id,
      type: 'kyc_submitted',
      title: 'KYC Application Submitted',
      message: 'Your KYC application has been submitted successfully. We will review it within 24-48 hours.',
      priority: 'medium',
      channels: ['email', 'in_app'],
      metadata: { kycId }
    });

    // Notify admin about new KYC application
    const admins = await db('users').where({ account_type: 'admin' }).select('id');
    for (const admin of admins) {
      await notificationService.sendNotification({
        userId: admin.id,
        type: 'admin_kyc_review',
        title: 'New KYC Application',
        message: `New KYC application submitted by ${user.first_name} ${user.last_name}`,
        priority: 'high',
        channels: ['email', 'in_app'],
        metadata: { kycId, userId: user.id }
      });
    }

    res.json({
      success: true,
      message: 'KYC application submitted successfully',
      data: {
        kycId,
        status: 'pending',
        documentsUploaded: uploadedDocuments.length
      }
    });

  } catch (error) {
    logger.error('KYC submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit KYC application'
    });
  }
});

// Get KYC application status
router.get('/status', async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;

    const kycApplication = await db('kyc_applications')
      .where({ user_id: user.id })
      .orderBy('created_at', 'desc')
      .first();

    if (!kycApplication) {
      return res.json({
        success: true,
        data: {
          status: 'not_started',
          message: 'No KYC application found'
        }
      });
    }

    // Get associated documents
    const documents = await db('kyc_documents')
      .where({ kyc_application_id: kycApplication.id })
      .select('document_type', 'verification_status', 'created_at');

    res.json({
      success: true,
      data: {
        id: kycApplication.id,
        status: kycApplication.status,
        submittedAt: kycApplication.submitted_at,
        reviewedAt: kycApplication.reviewed_at,
        rejectionReason: kycApplication.rejection_reason,
        documents: documents.map(doc => ({
          type: doc.document_type,
          status: doc.verification_status,
          uploadedAt: doc.created_at
        }))
      }
    });

  } catch (error) {
    logger.error('Get KYC status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get KYC status'
    });
  }
});

// Get KYC application details (for admin)
router.get('/applications/:kycId', async (req: AuthRequest, res: Response) => {
  try {
    const { kycId } = req.params;

    const application = await db('kyc_applications')
      .join('users', 'kyc_applications.user_id', 'users.id')
      .where('kyc_applications.id', kycId)
      .select(
        'kyc_applications.*',
        'users.email',
        'users.first_name',
        'users.last_name',
        'users.phone'
      )
      .first();

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'KYC application not found'
      });
    }

    const documents = await db('kyc_documents')
      .where({ kyc_application_id: kycId })
      .select('id', 'document_type', 'file_name', 'verification_status', 'created_at');

    res.json({
      success: true,
      data: {
        ...application,
        documents
      }
    });

  } catch (error) {
    logger.error('Get KYC application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get KYC application'
    });
  }
});

// Get KYC document (for viewing uploaded documents)
router.get('/document/:documentId', async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { documentId } = req.params;

    const document = await db('kyc_documents')
      .where({ id: documentId, user_id: user.id })
      .first();

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Serve from S3 (if configured) when local file is missing, else serve local file
    const localExists = document.file_path && fs.existsSync(document.file_path);
    if (!localExists && s3Enabled && s3) {
      try {
        const url = await getSignedUrl(
          s3,
          new GetObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: document.file_path }),
          { expiresIn: 60 * 5 }
        );
        return res.json({ success: true, data: { url, mime: document.mime_type, name: document.file_name } });
      } catch (e) {
        logger.error('Presign failed:', e);
        return res.status(404).json({ success: false, message: 'File not found' });
      }
    }

    if (localExists) {
      res.setHeader('Content-Type', document.mime_type);
      res.setHeader('Content-Disposition', `inline; filename="${document.file_name}"`);
      return res.sendFile(path.resolve(document.file_path));
    }

    return res.status(404).json({ success: false, message: 'File not found' });

  } catch (error) {
    logger.error('Get KYC document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get document'
    });
  }
});

// Admin: Approve/Reject KYC application
router.put('/applications/:kycId/review', [
  body('action').isIn(['approve', 'reject']).withMessage('Action must be approve or reject'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
  body('rejectionReason').if(body('action').equals('reject')).notEmpty().withMessage('Rejection reason is required')
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = req.user!;
    const { kycId } = req.params;
    const { action, notes, rejectionReason } = req.body;

    // Check if user is admin
    if (user.account_type !== 'corporate') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const application = await db('kyc_applications').where({ id: kycId }).first();
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'KYC application not found'
      });
    }

    const updateData: any = {
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewed_at: new Date(),
      reviewed_by: user.id,
      admin_notes: notes
    };

    if (action === 'reject') {
      updateData.rejection_reason = rejectionReason;
    }

    await db('kyc_applications').where({ id: kycId }).update(updateData);

    // Update user KYC status
    await db('users').where({ id: application.user_id }).update({
      kyc_status: action === 'approve' ? 'approved' : 'rejected',
      updated_at: new Date()
    });

    // Log audit trail
    logAudit('KYC_APPLICATION_REVIEWED', user.id, 'kyc', {
      kycId,
      action,
      userId: application.user_id
    });

    // Send notification to user
    const userInfo = await db('users').where({ id: application.user_id }).first();
    if (userInfo) {
      await notificationService.sendNotification({
        userId: application.user_id,
        type: action === 'approve' ? 'kyc_approved' : 'kyc_rejected',
        title: action === 'approve' ? 'KYC Approved' : 'KYC Application Rejected',
        message: action === 'approve'
          ? 'Your KYC verification has been approved. You now have full access to all banking features.'
          : `Your KYC application has been rejected. Reason: ${rejectionReason}`,
        priority: 'high',
        channels: ['email', 'in_app'],
        metadata: { kycId, action }
      });
    }

    res.json({
      success: true,
      message: `KYC application ${action}d successfully`,
      data: {
        kycId,
        status: updateData.status,
        reviewedAt: updateData.reviewed_at
      }
    });

  } catch (error) {
    logger.error('KYC review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to review KYC application'
    });
  }
});

export default router;
