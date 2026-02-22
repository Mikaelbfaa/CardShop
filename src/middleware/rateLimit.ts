import rateLimit from 'express-rate-limit';
import { rateLimitConfig } from '../config/rateLimit';

class RateLimitMiddleware {
    /**
     * Limiter global para todas as rotas /api/*.
     */
    global = rateLimit({
        windowMs: rateLimitConfig.global.windowMs,
        max: rateLimitConfig.global.max,
        standardHeaders: 'draft-7', // Cabeçalhos RateLimit-* no padrão IETF draft-7
        legacyHeaders: false,
        handler: (_req, res) => {
            res.status(429).json({
                error: {
                    message: 'Muitas requisições. Por favor, tente novamente mais tarde.',
                    status: 429,
                },
            });
        },
    });

    /**
     * Limiter restrito para rotas de autenticação (login/registro).
     */
    strict = rateLimit({
        windowMs: rateLimitConfig.strict.windowMs,
        max: rateLimitConfig.strict.max,
        standardHeaders: 'draft-7',
        legacyHeaders: false,
        handler: (_req, res) => {
            res.status(429).json({
                error: {
                    message:
                        'Muitas tentativas de autenticação. Por favor, tente novamente mais tarde.',
                    status: 429,
                },
            });
        },
    });
}

export default new RateLimitMiddleware();
