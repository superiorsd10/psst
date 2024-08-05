import express from 'express';
import { userController } from '../controllers/userController.js';
import { validationMiddleware } from '../middlewares/validationMiddleware.js';
import { registerSchema, loginSchema } from '../../schemas/userSchemas.js';

const router = express.Router();

/**
 * Route to register a new user.
 * Validates the request body against the register schema.
 */
router.post(
    '/register',
    validationMiddleware(registerSchema),
    userController.register
);

/**
 * Route to log in a user.
 * Validates the request body against the login schema.
 */
router.post(
    '/login',
    validationMiddleware(loginSchema),
    userController.login
);

export default router;
