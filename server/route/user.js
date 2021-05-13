import express from 'express';

import UserMiddleware from '../middleware/user';
import UserController from '../controller/user';
import Auth from '../middleware/auth';

const router = express.Router();

router.post('/',
  UserMiddleware.create,
  UserController.create
);

router.post('/login',
  UserMiddleware.login,
  UserController.login
);
router.post('/status',
  Auth.Authenticate,
  UserController.changeStatus,
);

export default router;
