import express from 'express';
import { userController } from '../controllers/userController';
import { validationMiddleware } from '../middlewares/validationMiddleware';
import { registerSchema, loginSchema } from '../../schemas/userSchemas';

const router = express.Router();

router.post(
    '/register',
    validationMiddleware(registerSchema),
    userController.register
);
router.post('/login', validationMiddleware(loginSchema), userController.login);

export default router;
