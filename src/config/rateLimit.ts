/**
 * Configuração de rate limiting da API.
 */
export const rateLimitConfig = {
    global: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
        max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    },
    strict: {
        windowMs: parseInt(process.env.RATE_LIMIT_STRICT_WINDOW_MS || '900000'),
        max: parseInt(process.env.RATE_LIMIT_STRICT_MAX || '10'),
    },
};
