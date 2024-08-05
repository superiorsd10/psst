import express from 'express';
import { pasteController } from '../controllers/pasteController.js';
import { validationMiddleware } from '../middlewares/validationMiddleware.js';
import { createPasteSchema } from '../../schemas/pasteSchemas.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getPasteMiddleware } from '../middlewares/getPasteMiddleware.js';

const router = express.Router();

/**
 * Route to create a new paste.
 * Requires authentication and validation of request body.
 */
router.post(
    '/',
    authMiddleware,
    validationMiddleware(createPasteSchema),
    pasteController.createPaste
);

/**
 * Route to get a paste by ID.
 * Optionally requires authentication based on paste visibility.
 */
router.get(
    '/:id',
    getPasteMiddleware,
    pasteController.getPaste
);

export default router;
