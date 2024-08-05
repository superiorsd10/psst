import express from 'express';
import { pasteController } from '../controllers/pasteController.js';
import { validationMiddleware } from '../middlewares/validationMiddleware.js';
import { createPasteSchema, getPasteSchema } from '../../schemas/pasteSchemas.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getPasteMiddleware } from '../middlewares/getPasteMiddleware.js';

const router = express.Router();

router.post(
    '/',
    authMiddleware,
    validationMiddleware(createPasteSchema),
    pasteController.createPaste
);

router.get(
    '/:id',
    getPasteMiddleware,
    pasteController.getPaste
);

export default router;
