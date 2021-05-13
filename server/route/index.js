import express from 'express';
import userRouter from './user';
import leadRouter from './emailLead';

const router = express.Router();

router.use('/users', userRouter);
router.use('/emails', leadRouter);
router.get('/health', (req, res) => res.status(200).json('server is up'));
export default router;
