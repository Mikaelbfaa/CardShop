import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

// Interface para o payload do JWT (para tipagem)
interface JwtPayload {
    userId: number;
    role: User['role'];
    iat: number;
    exp: number;
}

// Chave Secreta
const JWT_SECRET = process.env.JWT_SECRET || 'SEGREDO_FORTE';

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

        // Extrai 'Bearer' e o token
        const [scheme, token] = authHeader.split(' '); 

        if (scheme !== 'Bearer' || !token) {
            res.status(401).json({
                success: false,
                message: 'Formato do token inválido.',
            });
            return;
        }

        try {
            // Verifica o token usando a chave secreta
            const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

            // Injeta dados do usuário na requisição
            (req as any).userId = decoded.userId;
            (req as any).userRole = decoded.role;
            
            next();

        } catch (error) {
            // Captura token inválido ou expirado
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
        // userRole é injetado pelo verifyToken
        const userRole = (req as any).userRole;

        if (userRole !== 'ADMIN') {
            res.status(403).json({
                success: false,
                message: 'Acesso negado. Requer privilégios de Administrador.',
            });
            return;
        }
        
        // Se for ADMIN, permite seguir
        next();
    }
}

export default new AuthMiddleware();