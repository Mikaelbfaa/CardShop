import cartRepository, { CartWithItems, AddItemDTO } from '../repository/cart';
import prisma from '../database/prisma';

/**
 * Service de Carrinho.
 * Camada responsável pela lógica de negócio e validações.
 */
class CartService {
    /**
     * Buscar carrinho do usuário.
     * @param userId - ID do usuário.
     * @returns Carrinho do usuário.
     * @throws Error se o usuário não existir.
     */
    async getCart(userId: number): Promise<CartWithItems> {
        try {
            if (!userId) {
                throw new Error('userId é obrigatório');
            }

            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            return await cartRepository.findOrCreateByUserId(userId);
        } catch (error) {
            throw new Error(`Erro ao buscar carrinho: ${(error as Error).message}`);
        }
    }

    /**
     * Adicionar item ao carrinho.
     * Valida estoque e quantidade mínima de 1.
     * @param userId - ID do usuário.
     * @param data - Dados do item (productId, quantity).
     * @returns Carrinho atualizado.
     * @throws Error se estoque insuficiente ou dados inválidos.
     */
    async addToCart(userId: number, data: AddItemDTO): Promise<CartWithItems> {
        try {
            if (!userId) {
                throw new Error('userId é obrigatório');
            }

            if (!data.productId) {
                throw new Error('productId é obrigatório');
            }

            if (!data.quantity || data.quantity < 1) {
                throw new Error('Quantidade deve ser no mínimo 1');
            }

            const product = await prisma.product.findUnique({ where: { id: data.productId } });
            if (!product) {
                throw new Error('Produto não encontrado');
            }

            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            const cart = await cartRepository.findOrCreateByUserId(userId);
            const existingItem = await cartRepository.findCartItem(cart.id, data.productId);

            const currentQuantityInCart = existingItem?.quantity || 0;
            const newTotalQuantity = currentQuantityInCart + data.quantity;

            if (newTotalQuantity > product.stock) {
                throw new Error(
                    `Estoque insuficiente. Disponível: ${product.stock}, No carrinho: ${currentQuantityInCart}`
                );
            }

            if (existingItem) {
                await cartRepository.updateItemQuantity(cart.id, data.productId, newTotalQuantity);
            } else {
                await cartRepository.addItem(cart.id, data.productId, data.quantity);
            }

            return await cartRepository.findOrCreateByUserId(userId);
        } catch (error) {
            throw new Error(`Erro ao adicionar ao carrinho: ${(error as Error).message}`);
        }
    }

    /**
     * Atualizar quantidade de item no carrinho.
     * Valida estoque e quantidade mínima de 1.
     * @param userId - ID do usuário.
     * @param productId - ID do produto.
     * @param quantity - Nova quantidade.
     * @returns Carrinho atualizado.
     * @throws Error se estoque insuficiente ou item não encontrado.
     */
    async updateQuantity(
        userId: number,
        productId: number,
        quantity: number
    ): Promise<CartWithItems> {
        try {
            if (!userId) {
                throw new Error('userId é obrigatório');
            }

            if (!productId) {
                throw new Error('productId é obrigatório');
            }

            if (quantity < 1) {
                throw new Error('Quantidade deve ser no mínimo 1');
            }

            const cart = await cartRepository.findByUserId(userId);
            if (!cart) {
                throw new Error('Carrinho não encontrado');
            }

            const existingItem = await cartRepository.findCartItem(cart.id, productId);
            if (!existingItem) {
                throw new Error('Item não encontrado no carrinho');
            }

            const product = await prisma.product.findUnique({ where: { id: productId } });
            if (!product) {
                throw new Error('Produto não encontrado');
            }

            if (quantity > product.stock) {
                throw new Error(`Estoque insuficiente. Disponível: ${product.stock}`);
            }

            await cartRepository.updateItemQuantity(cart.id, productId, quantity);

            return await cartRepository.findOrCreateByUserId(userId);
        } catch (error) {
            throw new Error(`Erro ao atualizar quantidade: ${(error as Error).message}`);
        }
    }

    /**
     * Remover item do carrinho.
     * @param userId - ID do usuário.
     * @param productId - ID do produto a remover.
     * @returns Carrinho atualizado.
     * @throws Error se o item não existir no carrinho.
     */
    async removeFromCart(userId: number, productId: number): Promise<CartWithItems> {
        try {
            if (!userId) {
                throw new Error('userId é obrigatório');
            }

            if (!productId) {
                throw new Error('productId é obrigatório');
            }

            const cart = await cartRepository.findByUserId(userId);
            if (!cart) {
                throw new Error('Carrinho não encontrado');
            }

            const existingItem = await cartRepository.findCartItem(cart.id, productId);
            if (!existingItem) {
                throw new Error('Item não encontrado no carrinho');
            }

            await cartRepository.removeItem(cart.id, productId);

            return await cartRepository.findOrCreateByUserId(userId);
        } catch (error) {
            throw new Error(`Erro ao remover item: ${(error as Error).message}`);
        }
    }

    /**
     * Limpar carrinho.
     * @param userId - ID do usuário.
     * @returns Carrinho vazio.
     * @throws Error se o carrinho não existir.
     */
    async clearCart(userId: number): Promise<CartWithItems> {
        try {
            if (!userId) {
                throw new Error('userId é obrigatório');
            }

            const cart = await cartRepository.findByUserId(userId);
            if (!cart) {
                throw new Error('Carrinho não encontrado');
            }

            await cartRepository.clearCart(cart.id);

            return await cartRepository.findOrCreateByUserId(userId);
        } catch (error) {
            throw new Error(`Erro ao limpar carrinho: ${(error as Error).message}`);
        }
    }
}

export default new CartService();
