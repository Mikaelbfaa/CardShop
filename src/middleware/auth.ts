/**
 * Middleware de Autenticação
 * A ser implementado com JWT
 */

class AuthMiddleware {
    /**
     * Verificar se o token JWT é válido
     */
    async verifyToken(req, res, next) {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Token não fornecido'
                });
            }

            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }
    }

    /**
     * Verificar se o usuário é administrador
     */
    async isAdmin(req, res, next) {
        try {
            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Erro ao verificar permissões'
            });
        }
    }
}

module.exports = new AuthMiddleware();
