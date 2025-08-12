import { Router } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import { db } from '../config/db';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult } from 'express-validator';
import { TemplateCache } from '../services/templateCache';

const router = Router();

router.use(AuthMiddleware.verifyToken, AuthMiddleware.requireRole(['corporate']));

router.get('/', async (req, res) => {
  const { locale } = req.query;
  const localeStr = locale as string;

  // Try cache first
  const cached = await TemplateCache.getTemplateList(localeStr);
  if (cached) {
    return res.json({ success: true, data: cached, cached: true });
  }

  // Fetch from database
  let query = db('message_templates').select('*');
  if (localeStr) query = query.where('locale', localeStr);
  const templates = await query.orderBy([{ column: 'type' }, { column: 'step_order' }]);

  // Cache the result
  await TemplateCache.setTemplateList(templates, localeStr);
  res.json({ success: true, data: templates, cached: false });
});

router.post('/', [
  body('type').isString(),
  body('channel').isIn(['email','sms','in_app']),
  body('locale').optional().isString(),
  body('name').isString(),
  body('subject').optional().isString(),
  body('body').isString(),
  body('stepOrder').optional().isInt()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  const { type, channel, locale='en', name, subject, body: content, stepOrder, icon } = req.body;
  const record = { id: uuidv4(), type, channel, locale, name, subject, body: content, step_order: stepOrder, icon, is_default: false, version: 1 };
  await db('message_templates').insert(record);

  // Invalidate cache
  await TemplateCache.invalidateTemplateCache();
  res.status(201).json({ success: true, data: record });
});

router.put('/:id', [body('body').optional().isString()], async (req, res) => {
  const { id } = req.params;
  const updates: any = { updated_at: new Date() };
  ['name','subject','body','locale','icon','step_order'].forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
  await db('message_templates').where({ id }).update(updates);
  const updated = await db('message_templates').where({ id }).first();

  // Invalidate cache
  await TemplateCache.invalidateTemplateCache(id);
  res.json({ success: true, data: updated });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db('message_templates').where({ id }).del();

  // Invalidate cache
  await TemplateCache.invalidateTemplateCache(id);
  res.json({ success: true, message: 'Template deleted' });
});

// Provider health (email & basic SMS presence)
router.get('/_health/providers', async (req, res) => {
  try {
    const { EmailService } = require('../services/emailService');
    const emailService = new EmailService();
    const emailStatus = await emailService.getProviderStatus();
    const smsProviders = [
      { name: 'textbelt', healthy: !!process.env.TEXTBELT_API_KEY },
      { name: 'twilio', healthy: !!process.env.TWILIO_ACCOUNT_SID && !!process.env.TWILIO_AUTH_TOKEN },
      { name: 'vonage', healthy: !!process.env.VONAGE_API_KEY && !!process.env.VONAGE_API_SECRET },
      { name: 'messagebird', healthy: !!process.env.MESSAGEBIRD_API_KEY },
      { name: 'plivo', healthy: !!process.env.PLIVO_AUTH_ID && !!process.env.PLIVO_AUTH_TOKEN }
    ];
    res.json({ success: true, data: { email: emailStatus, sms: smsProviders } });
  } catch (e:any) {
    res.status(500).json({ success:false, message: e.message });
  }
});

// Render endpoint (server-side variable substitution & safe HTML)
router.post('/render', [
  body('template').isString(),
  body('data').optional().isObject(),
  body('options').optional().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const { template, data = {}, options = {} } = req.body;

    // Check cache first
    const cached = await TemplateCache.getRenderResult(template, data, options);
    if (cached) {
      return res.json({ success: true, data: cached, cached: true });
    }

    // Render fresh
    const { renderTemplate } = require('../services/templateRenderer');
    const globals = {
      bankName: process.env.BANK_NAME || 'UBAS Financial Trust',
      supportEmail: process.env.FROM_EMAIL || 'info@ubasfintrust.com',
      frontendUrl: process.env.FRONTEND_URL,
      backendUrl: process.env.BACKEND_URL
    };
    const result = renderTemplate(template, data, { ...options, globals });

    // Cache the result
    await TemplateCache.setRenderResult(template, data, options, result);
    return res.json({ success: true, data: result, cached: false });
  } catch (e:any) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

export default router;
