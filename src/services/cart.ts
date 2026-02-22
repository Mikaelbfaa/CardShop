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
            // Validação de parâmetro obrigatório
            if (!userId) {
                throw new Error('userId é obrigatório');
            }

            // Verifica se o usuário existe antes de buscar/criar carrinho
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
            // Validação de parâmetros obrigatórios
            if (!userId) {
                throw new Error('userId é obrigatório');
            }

            if (!data.productId) {
                throw new Error('productId é obrigatório');
            }

            // Rejeita quantidade zero, negativa ou não fornecida
            if (!data.quantity || data.quantity < 1) {
                throw new Error('Quantidade deve ser no mínimo 1');
            }

            // Verifica se produto e usuário existem no banco antes de manipular o carrinho
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

            // Quantidade é somada à existente no carrinho, não substituída
            const currentQuantityInCart = existingItem?.quantity || 0;
            const newTotalQuantity = currentQuantityInCart + data.quantity;

            // Valida estoque considerando a soma (existente + nova), não apenas a nova quantidade
            if (newTotalQuantity > product.stock) {
                throw new Error(
                    `Estoque insuficiente. Disponível: ${product.stock}, No carrinho: ${currentQuantityInCart}`
                );
            }

            // Se o item já existe no carrinho, atualiza a quantidade total; senão, adiciona novo
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
            // Validação de parâmetros obrigatórios
            if (!userId) {
                throw new Error('userId é obrigatório');
            }

            if (!productId) {
                throw new Error('productId é obrigatório');
            }

            // Quantidade mínima permitida no carrinho
            if (quantity < 1) {
                throw new Error('Quantidade deve ser no mínimo 1');
            }

            // Verifica existência de carrinho, item e produto antes de atualizar
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

            // Aqui a quantity é absoluta (substitui), diferente do addToCart que soma
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
            // Validação de parâmetros obrigatórios
            if (!userId) {
                throw new Error('userId é obrigatório');
            }

            if (!productId) {
                throw new Error('productId é obrigatório');
            }

            // Verifica existência de carrinho e item antes de tentar remover
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
            // Validação de parâmetro obrigatório
            if (!userId) {
                throw new Error('userId é obrigatório');
            }

            // Verifica existência do carrinho antes de limpar
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
