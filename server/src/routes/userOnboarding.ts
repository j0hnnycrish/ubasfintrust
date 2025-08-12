import { Router } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import { db } from '../config/db';

const router = Router();
router.use(AuthMiddleware.verifyToken);

router.post('/complete', async (req, res) => {
  const user = (req as any).user;
  await db('users').where({ id: user.id }).update({ onboarding_completed: true, onboarding_completed_at: new Date() });
  res.json({ success: true, message: 'Onboarding completed' });
});

export default router;
