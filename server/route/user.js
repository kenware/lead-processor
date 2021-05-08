import express from 'express';

import UserMiddleware from '../middleware/user';
import UserController from '../controller/user';

const router = express.Router();

router.post('/',
  UserMiddleware.create,
  UserController.create
);

router.post('/login',
  UserMiddleware.login,
  UserController.login
);

export default router;
