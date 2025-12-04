import { Request, Response, NextFunction } from 'express';
import cartService from '../services/cart';

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
    async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = parseInt(req.query.userId as string);

            if (!userId || isNaN(userId)) {
                res.status(400).json({
                    success: false,
                    message: 'userId é obrigatório',
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
     * @param req - Objeto de requisição Express (body: userId, productId, quantity).
     * @param res - Objeto de resposta Express.
     * @param next - Função para passar erros ao middleware.
     */
    async addItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, productId, quantity } = req.body;

            if (!userId) {
                res.status(400).json({
                    success: false,
                    message: 'userId é obrigatório',
                });
                return;
            }

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
     * @param req - Objeto de requisição Express (params: productId, query: userId, body: quantity).
     * @param res - Objeto de resposta Express.
     * @param next - Função para passar erros ao middleware.
     */
    async updateItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const productId = parseInt(req.params.productId);
            const userId = parseInt(req.query.userId as string);
            const { quantity } = req.body;

            if (!userId || isNaN(userId)) {
                res.status(400).json({
                    success: false,
                    message: 'userId é obrigatório',
                });
                return;
            }

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
     * @param req - Objeto de requisição Express (params: productId, query: userId).
     * @param res - Objeto de resposta Express.
     * @param next - Função para passar erros ao middleware.
     */
    async removeItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const productId = parseInt(req.params.productId);
            const userId = parseInt(req.query.userId as string);

            if (!userId || isNaN(userId)) {
                res.status(400).json({
                    success: false,
                    message: 'userId é obrigatório',
                });
                return;
            }

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
     * @param req - Objeto de requisição Express (query: userId).
     * @param res - Objeto de resposta Express.
     * @param next - Função para passar erros ao middleware.
     */
    async clearCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = parseInt(req.query.userId as string);

            if (!userId || isNaN(userId)) {
                res.status(400).json({
                    success: false,
                    message: 'userId é obrigatório',
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
