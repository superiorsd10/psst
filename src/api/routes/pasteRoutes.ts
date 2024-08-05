import express from 'express';
import { pasteController } from '../controllers/pasteController';
import { validationMiddleware } from '../middlewares/validationMiddleware';
import { createPasteSchema, getPasteSchema } from '../../schemas/pasteSchemas';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post(
    '/',
    authMiddleware,
    validationMiddleware(createPasteSchema),
    pasteController.createPaste
);

router.get(
    '/:id',
    validationMiddleware(getPasteSchema),
    pasteController.getPaste
);

export default router;
