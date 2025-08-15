import express from 'express';
import { auditLogger, logger } from '../utils/logger';

const router = express.Router();

const openai: any = null;

router.post('/ai', async (req: any, res: any) => {
  const { message } = req.body;
  const user = (req as any).user || null; // If you have authentication middleware, attach user info
  if (!message) return res.status(400).json({ error: 'Message required' });
  try {
    const reply = 'Support is not enabled in this environment.';
    // Log support event (for analytics/compliance)
    auditLogger.info({
      event: 'support_chat',
      type: 'support',
      user: user ? { id: (user as any).id, email: (user as any).email } : null,
      message,
      ai_response: reply,
      timestamp: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
    res.json({ reply });
  } catch (err) {
    auditLogger.error({
      event: 'support_chat_error',
      type: 'support',
      user: user ? { id: (user as any).id, email: (user as any).email } : null,
      message,
      error: (err as any).message,
      timestamp: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
    res.status(500).json({ error: 'AI support unavailable.' });
  }
});

export default router;

// Contact form submission
router.post('/contact', async (req: any, res: any) => {
  try {
    const { name, email, phone, subject, category, message } = req.body || {};

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'name, email and message are required' });
    }

    const payload = {
      name: String(name).trim(),
      email: String(email).trim(),
      phone: phone ? String(phone).trim() : undefined,
      subject: subject ? String(subject).trim() : 'Website Contact',
      category: category ? String(category).trim() : 'general',
      message: String(message).trim(),
    };

    // Log for audit/compliance
    auditLogger.info({
      event: 'contact_form_submitted',
      type: 'support',
      payload,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString(),
    });

    // Try to send an email notification if a provider is configured
    let emailResult: any = { success: false, provider: 'none' };
  try {
      const { EmailService } = await import('../services/emailService');
      const emailService = new EmailService();
      emailResult = await emailService.sendEmail({
    to: process.env.ADMIN_EMAIL || process.env.FROM_EMAIL || 'no-reply@alerts.ubasfintrust.com',
        subject: `[UBAS Website Contact] ${payload.subject} (${payload.category})`,
        text: `New contact form submission\n\nName: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone || '-'}\nCategory: ${payload.category}\n\nMessage:\n${payload.message}`,
        html: `<p><strong>New contact form submission</strong></p>
               <p><b>Name:</b> ${payload.name}<br/>
               <b>Email:</b> ${payload.email}<br/>
               <b>Phone:</b> ${payload.phone || '-'}<br/>
               <b>Category:</b> ${payload.category}</p>
               <p><b>Message:</b><br/>${payload.message.replace(/\n/g, '<br/>')}</p>`,
      });
    } catch (err) {
      logger.warn('Contact email not sent (no provider configured or error). Proceeding anyway.', { error: (err as any)?.message });
    }

    return res.status(200).json({ success: true, delivered: !!emailResult?.success, provider: emailResult?.provider || 'unknown' });
  } catch (error: any) {
    auditLogger.error({
      event: 'contact_form_error',
      type: 'support',
      error: error?.message,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString(),
    });
    return res.status(500).json({ success: false, error: 'Failed to submit contact request' });
  }
});
