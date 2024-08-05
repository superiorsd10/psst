import express from 'express';
import { userController } from '../controllers/userController.js';
import { validationMiddleware } from '../middlewares/validationMiddleware.js';
import { registerSchema, loginSchema } from '../../schemas/userSchemas.js';

const router = express.Router();

router.post(
    '/register',
    validationMiddleware(registerSchema),
    userController.register
);
router.post('/login', validationMiddleware(loginSchema), userController.login);

export default router;
