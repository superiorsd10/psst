import { Request, Response, NextFunction } from 'express';
import { pasteService } from '../../services/pasteService.js';
import { CreatePasteInput } from '../../schemas/pasteSchemas.js';

class PasteController {
    /**
     * Create a new paste.
     * 
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @param {NextFunction} next - The next middleware function.
     * @returns {Promise<void>}
     */
    async createPaste(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const input: CreatePasteInput = req.body;
            const userId = req.userId!;
            const result = await pasteService.createPaste(input, userId);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get a paste by ID.
     * 
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @param {NextFunction} next - The next middleware function.
     * @returns {Promise<void>}
     */
    async getPaste(req: Request, res: Response, next: NextFunction): Promise<void> {
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
