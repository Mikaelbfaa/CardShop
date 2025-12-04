import prisma from '../database/prisma';
import { CartItem, Prisma } from '@prisma/client';

/**
 * DTO para adição de item ao carrinho.
 */
export interface AddItemDTO {
    productId: number;
    quantity: number;
}

/**
 * Tipo de carrinho com itens e produtos incluídos.
 */
export type CartWithItems = Prisma.CartGetPayload<{
    include: {
        items: {
            include: {
                product: true;
            };
        };
    };
}>;

/**
 * Repository de Carrinho.
 * Camada responsável pelo acesso direto aos dados via Prisma.
 */
class CartRepository {
    /**
     * Buscar carrinho por ID do usuário com itens e produtos.
     * @param userId - ID do usuário.
     * @returns Carrinho com itens ou null se não encontrado.
     */
    async findByUserId(userId: number): Promise<CartWithItems | null> {
        return prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });
    }

    /**
     * Buscar ou criar carrinho para o usuário.
     * @param userId - ID do usuário.
     * @returns Carrinho existente ou recém-criado.
     */
    async findOrCreateByUserId(userId: number): Promise<CartWithItems> {
        const existingCart = await this.findByUserId(userId);

        if (existingCart) {
            return existingCart;
        }

        return prisma.cart.create({
            data: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }

    /**
     * Buscar item específico do carrinho.
     * @param cartId - ID do carrinho.
     * @param productId - ID do produto.
     * @returns Item do carrinho ou null se não encontrado.
     */
    async findCartItem(cartId: number, productId: number): Promise<CartItem | null> {
        return prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId,
                    productId,
                },
            },
        });
    }

    /**
     * Adicionar item ao carrinho.
     * @param cartId - ID do carrinho.
     * @param productId - ID do produto.
     * @param quantity - Quantidade a adicionar.
     * @returns Item criado.
     */
    async addItem(cartId: number, productId: number, quantity: number): Promise<CartItem> {
        return prisma.cartItem.create({
            data: {
                cartId,
                productId,
                quantity,
            },
        });
    }

    /**
     * Atualizar quantidade de item existente.
     * @param cartId - ID do carrinho.
     * @param productId - ID do produto.
     * @param quantity - Nova quantidade.
     * @returns Item atualizado.
     */
    async updateItemQuantity(
        cartId: number,
        productId: number,
        quantity: number
    ): Promise<CartItem> {
        return prisma.cartItem.update({
            where: {
                cartId_productId: {
                    cartId,
                    productId,
                },
            },
            data: { quantity },
        });
    }

    /**
     * Remover item do carrinho.
     * @param cartId - ID do carrinho.
     * @param productId - ID do produto.
     * @returns True se removido, false se não encontrado.
     */
    async removeItem(cartId: number, productId: number): Promise<boolean> {
        try {
            await prisma.cartItem.delete({
                where: {
                    cartId_productId: {
                        cartId,
                        productId,
                    },
                },
            });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Limpar todos os itens do carrinho.
     * @param cartId - ID do carrinho.
     * @returns True se limpo com sucesso, false em caso de erro.
     */
    async clearCart(cartId: number): Promise<boolean> {
        try {
            await prisma.cartItem.deleteMany({
                where: { cartId },
            });
            return true;
        } catch {
            return false;
        }
    }
}

export default new CartRepository();
