import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import cartService from '../services/cart';

/**
 * Resolve o userId a partir do token JWT ou do parâmetro explícito (query/body).
 * Admins podem operar no carrinho de outros usuários; usuários comuns, apenas no próprio.
 * @returns userId resolvido, ou null se o acesso não for autorizado.
 */
function resolveUserId(req: AuthenticatedRequest, source: 'query' | 'body'): number | null {
    const tokenUserId = req.userId!;
    const tokenRole = req.userRole;
    const paramUserId =
        source === 'query' ? parseInt(req.query.userId as string) : parseInt(req.body.userId);

    // No explicit userId provided, or same as token → use own
    if (!paramUserId || isNaN(paramUserId) || paramUserId === tokenUserId) {
        return tokenUserId;
    }
    // Different userId provided → admin only
    if (tokenRole === 'ADMIN') {
        return paramUserId;
    }
    // Non-admin trying to access another user's cart
    return null;
}

/**
 * Controller de Carrinho.
 * Camada responsável por receber requisições HTTP,
 * validar dados de entrada e retornar respostas apropriadas.
 */
class CartController {
    /**
     * Visualizar carrinho do usuário.
     * @param req - Objeto de requisição Express (query: userId).
     * @param res - Objeto de resposta Express.
     * @param next - Função para passar erros ao middleware.
     */
    async getCart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = resolveUserId(req, 'query');
            if (!userId) {
                res.status(403).json({
                    success: false,
                    message: 'Acesso negado. Você só pode acessar seu próprio carrinho.',
                });
                return;
            }

            const cart = await cartService.getCart(userId);

            res.status(200).json({
                success: true,
                data: cart,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Adicionar item ao carrinho.
     * @param req - Objeto de requisição Express (body: productId, quantity).
     * @param res - Objeto de resposta Express.
     * @param next - Função para passar erros ao middleware.
     */
    async addItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = resolveUserId(req, 'body');
            if (!userId) {
                res.status(403).json({
                    success: false,
                    message: 'Acesso negado. Você só pode acessar seu próprio carrinho.',
                });
                return;
            }

            const { productId, quantity } = req.body;

            if (!productId) {
                res.status(400).json({
                    success: false,
                    message: 'productId é obrigatório',
                });
                return;
            }

            const cart = await cartService.addToCart(userId, {
                productId,
                quantity: quantity || 1,
            });

            res.status(200).json({
                success: true,
                message: 'Item adicionado ao carrinho',
                data: cart,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Atualizar quantidade de item no carrinho.
     * @param req - Objeto de requisição Express (params: productId, body: quantity).
     * @param res - Objeto de resposta Express.
     * @param next - Função para passar erros ao middleware.
     */
    async updateItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = resolveUserId(req, 'query');
            if (!userId) {
                res.status(403).json({
                    success: false,
                    message: 'Acesso negado. Você só pode acessar seu próprio carrinho.',
                });
                return;
            }

            const productId = parseInt(req.params.productId);
            const { quantity } = req.body;

            if (!productId || isNaN(productId)) {
                res.status(400).json({
                    success: false,
                    message: 'productId inválido',
                });
                return;
            }

            if (!quantity || quantity < 1) {
                res.status(400).json({
                    success: false,
                    message: 'Quantidade deve ser no mínimo 1',
                });
                return;
            }

            const cart = await cartService.updateQuantity(userId, productId, quantity);

            res.status(200).json({
                success: true,
                message: 'Quantidade atualizada',
                data: cart,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Remover item do carrinho.
     * @param req - Objeto de requisição Express (params: productId).
     * @param res - Objeto de resposta Express.
     * @param next - Função para passar erros ao middleware.
     */
    async removeItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = resolveUserId(req, 'query');
            if (!userId) {
                res.status(403).json({
                    success: false,
                    message: 'Acesso negado. Você só pode acessar seu próprio carrinho.',
                });
                return;
            }

            const productId = parseInt(req.params.productId);

            if (!productId || isNaN(productId)) {
                res.status(400).json({
                    success: false,
                    message: 'productId inválido',
                });
                return;
            }

            const cart = await cartService.removeFromCart(userId, productId);

            res.status(200).json({
                success: true,
                message: 'Item removido do carrinho',
                data: cart,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Limpar carrinho.
     * @param req - Objeto de requisição Express.
     * @param res - Objeto de resposta Express.
     * @param next - Função para passar erros ao middleware.
     */
    async clearCart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = resolveUserId(req, 'query');
            if (!userId) {
                res.status(403).json({
                    success: false,
                    message: 'Acesso negado. Você só pode acessar seu próprio carrinho.',
                });
                return;
            }

            const cart = await cartService.clearCart(userId);

            res.status(200).json({
                success: true,
                message: 'Carrinho limpo',
                data: cart,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new CartController();
