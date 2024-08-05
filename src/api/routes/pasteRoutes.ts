import express from 'express';
import { pasteController } from '../controllers/pasteController';
import { validationMiddleware } from '../middlewares/validationMiddleware';
import { createPasteSchema, getPasteSchema } from '../../schemas/pasteSchemas';
import { authMiddleware } from '../middlewares/authMiddleware';
import { getPasteMiddleware } from '../middlewares/getPasteMiddleware';

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
    validationMiddleware(getPasteSchema),
    pasteController.getPaste
);

export default router;
