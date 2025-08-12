import express from 'express';
// import { Configuration, OpenAIApi } from 'openai';
import { auditLogger } from '../utils/logger';

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
