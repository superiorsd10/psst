import { Request, Response, NextFunction } from 'express';
import { pasteService } from '../../services/pasteService';
import { CreatePasteInput } from '../../schemas/pasteSchemas';

class PasteController {
    async createPaste(req: Request, res: Response, next: NextFunction) {
        try {
            const input: CreatePasteInput = req.body;
            const userId = req.userId!;
            const result = await pasteService.createPaste(input, userId);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getPaste(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { password } = req.query;
            const userId = req.userId;
            const paste = await pasteService.getPaste(
                id,
                password as string | undefined,
                userId
            );
            res.json(paste);
        } catch (error) {
            next(error);
        }
    }
}

export const pasteController = new PasteController();
