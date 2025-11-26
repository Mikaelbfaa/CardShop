import { Request, Response, NextFunction } from 'express';

class AuthMiddleware {
    /**
     * Verificar se o token JWT é válido
     */
    async verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                res.status(401).json({
                    success: false,
                    message: 'Token não fornecido'
                });
                return;
            }

            // TODO: Implementar verificação real do JWT
            next();
        } catch {
            res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }
    }

    /**
     * Verificar se o usuário é administrador
     */
    async isAdmin(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // TODO: Implementar verificação real de admin
            next();
        } catch {
            res.status(500).json({
                success: false,
                message: 'Erro ao verificar permissões'
            });
        }
    }
}

export default new AuthMiddleware();
