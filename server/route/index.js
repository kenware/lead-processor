import express from 'express';
import userRouter from './user';

const router = express.Router();

router.use('/users', userRouter);
router.get('/health', (req, res) => res.status(200).json('server is up'));

export default router;
