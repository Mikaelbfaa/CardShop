import prisma from '../database/prisma';
import { CartItem, Prisma } from '@prisma/client';

export interface AddItemDTO {
    productId: number;
    quantity: number;
}

export type CartWithItems = Prisma.CartGetPayload<{
    include: {
        items: {
            include: {
                product: true;
            };
        };
    };
}>;

class CartRepository {
    /**
     * Buscar carrinho por ID do usuário com itens e produtos
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
     * Buscar ou criar carrinho para o usuário
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
     * Buscar item específico do carrinho
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
     * Adicionar item ao carrinho
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
     * Atualizar quantidade de item existente
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
     * Remover item do carrinho
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
     * Limpar todos os itens do carrinho
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
