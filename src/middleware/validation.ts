/**
 * Middleware de Validação
 * Validações genéricas para requisições
 */

class ValidationMiddleware {
    /**
     * Validar ID numérico nos parâmetros
     */
    validateId(req, res, next) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido'
            });
        }

        next();
    }

    /**
     * Validar corpo da requisição não vazio
     */
    validateBody(req, res, next) {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Corpo da requisição não pode estar vazio'
            });
        }

        next();
    }

    /**
     * Validar campos obrigatórios
     */
    validateRequiredFields(requiredFields) {
        return (req, res, next) => {
            const missingFields = [];

            for (const field of requiredFields) {
                if (!req.body[field]) {
                    missingFields.push(field);
                }
            }

            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Campos obrigatórios ausentes',
                    missingFields
                });
            }

            next();
        };
    }
}

module.exports = new ValidationMiddleware();
