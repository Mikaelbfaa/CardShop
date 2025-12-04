import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { JWT_SECRET } from '../config/server';

/**
 * Payload do token JWT.
 */
interface JwtPayload {
    userId: number;
    role: User['role'];
    iat: number;
    exp: number;
}

/**
 * Request com dados do usuário autenticado.
 */
export interface AuthenticatedRequest extends Request {
    userId?: number;
    userRole?: User['role'];
}

class AuthMiddleware {
    /**
     * Verificar se o token JWT é válido e injetar userId/userRole na requisição.
     */
    async verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({
                success: false,
                message: 'Acesso negado. Token não fornecido.',
            });
            return;
        }

        const [scheme, token] = authHeader.split(' ');

        if (scheme !== 'Bearer' || !token) {
            res.status(401).json({
                success: false,
                message: 'Formato do token inválido.',
            });
            return;
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
            (req as AuthenticatedRequest).userId = decoded.userId;
            (req as AuthenticatedRequest).userRole = decoded.role;

            next();
        } catch {
            res.status(401).json({
                success: false,
                message: 'Token inválido ou expirado.',
            });
        }
    }

    /**
     * Verificar se o usuário é administrador (Deve ser chamado após verifyToken).
     */
    async isAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userRole = (req as AuthenticatedRequest).userRole;

        if (userRole !== 'ADMIN') {
            res.status(403).json({
                success: false,
                message: 'Acesso negado. Requer privilégios de Administrador.',
            });
            return;
        }

        next();
    }
}

export default new AuthMiddleware();
