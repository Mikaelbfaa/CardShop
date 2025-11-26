import { Request, Response, NextFunction } from 'express';

/**
 * Middleware de Validação
 * Validações genéricas para requisições
 */

class ValidationMiddleware {
    /**
     * Validar ID numérico nos parâmetros
     */
    validateId(req: Request, res: Response, next: NextFunction): void {
        const { id } = req.params;

        if (!id || isNaN(Number(id))) {
            res.status(400).json({
                success: false,
                message: 'ID inválido'
            });
            return;
        }

        next();
    }

    /**
     * Validar corpo da requisição não vazio
     */
    validateBody(req: Request, res: Response, next: NextFunction): void {
        if (!req.body || Object.keys(req.body).length === 0) {
            res.status(400).json({
                success: false,
                message: 'Corpo da requisição não pode estar vazio'
            });
            return;
        }

        next();
    }

    /**
     * Validar campos obrigatórios
     */
    validateRequiredFields(requiredFields: string[]) {
        return (req: Request, res: Response, next: NextFunction): void => {
            const missingFields: string[] = [];

            for (const field of requiredFields) {
                if (!req.body[field]) {
                    missingFields.push(field);
                }
            }

            if (missingFields.length > 0) {
                res.status(400).json({
                    success: false,
                    message: 'Campos obrigatórios ausentes',
                    missingFields
                });
                return;
            }

            next();
        };
    }
}

export default new ValidationMiddleware();
