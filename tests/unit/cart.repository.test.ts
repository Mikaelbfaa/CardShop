import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../src/database/prisma';
import cartRepository from '../../src/repository/cart';

describe('CartRepository', () => {
    let originalCart: any;
    let originalCartItem: any;

    beforeEach(() => {
        originalCart = (prisma as any).cart;
        originalCartItem = (prisma as any).cartItem;
    });

    afterEach(() => {
        (prisma as any).cart = originalCart;
        (prisma as any).cartItem = originalCartItem;
        sinon.restore();
    });

    describe('findByUserId', () => {
        it('deve retornar carrinho do usuário com itens', async () => {
            const cart = {
                id: 1,
                userId: 1,
                items: [{ cartId: 1, productId: 1, quantity: 2, product: { id: 1 } }],
            };

            (prisma as any).cart = {
                findUnique: sinon.stub().resolves(cart),
            };

            const result = await cartRepository.findByUserId(1);

            expect(result).to.not.be.null;
            expect(result!.id).to.equal(1);
            expect(result!.items).to.have.lengthOf(1);
        });

        it('deve retornar null quando carrinho não existe', async () => {
            (prisma as any).cart = {
                findUnique: sinon.stub().resolves(null),
            };

            const result = await cartRepository.findByUserId(999);

            expect(result).to.be.null;
        });
    });

    describe('findOrCreateByUserId', () => {
        it('deve retornar carrinho existente', async () => {
            const cart = { id: 1, userId: 1, items: [] };

            (prisma as any).cart = {
                findUnique: sinon.stub().resolves(cart),
            };

            const result = await cartRepository.findOrCreateByUserId(1);

            expect(result.id).to.equal(1);
        });

        it('deve criar novo carrinho quando não existe', async () => {
            const newCart = { id: 2, userId: 1, items: [] };

            (prisma as any).cart = {
                findUnique: sinon.stub().resolves(null),
                create: sinon.stub().resolves(newCart),
            };

            const result = await cartRepository.findOrCreateByUserId(1);

            expect(result.id).to.equal(2);
        });
    });

    describe('findCartItem', () => {
        it('deve retornar item do carrinho', async () => {
            const item = { cartId: 1, productId: 1, quantity: 2 };

            (prisma as any).cartItem = {
                findUnique: sinon.stub().resolves(item),
            };

            const result = await cartRepository.findCartItem(1, 1);

            expect(result).to.not.be.null;
            expect(result!.quantity).to.equal(2);
        });

        it('deve retornar null quando item não existe', async () => {
            (prisma as any).cartItem = {
                findUnique: sinon.stub().resolves(null),
            };

            const result = await cartRepository.findCartItem(1, 999);

            expect(result).to.be.null;
        });
    });

    describe('addItem', () => {
        it('deve adicionar item ao carrinho', async () => {
            const item = { cartId: 1, productId: 1, quantity: 3 };

            (prisma as any).cartItem = {
                create: sinon.stub().resolves(item),
            };

            const result = await cartRepository.addItem(1, 1, 3);

            expect(result.quantity).to.equal(3);
        });
    });

    describe('updateItemQuantity', () => {
        it('deve atualizar quantidade do item', async () => {
            const updatedItem = { cartId: 1, productId: 1, quantity: 5 };

            (prisma as any).cartItem = {
                update: sinon.stub().resolves(updatedItem),
            };

            const result = await cartRepository.updateItemQuantity(1, 1, 5);

            expect(result.quantity).to.equal(5);
        });
    });

    describe('removeItem', () => {
        it('deve retornar true quando item é removido', async () => {
            (prisma as any).cartItem = {
                delete: sinon.stub().resolves({}),
            };

            const result = await cartRepository.removeItem(1, 1);

            expect(result).to.be.true;
        });

        it('deve retornar false quando remoção falha', async () => {
            (prisma as any).cartItem = {
                delete: sinon.stub().rejects(new Error('Not found')),
            };

            const result = await cartRepository.removeItem(1, 999);

            expect(result).to.be.false;
        });
    });

    describe('clearCart', () => {
        it('deve retornar true quando carrinho é limpo', async () => {
            (prisma as any).cartItem = {
                deleteMany: sinon.stub().resolves({ count: 2 }),
            };

            const result = await cartRepository.clearCart(1);

            expect(result).to.be.true;
        });

        it('deve retornar false quando limpeza falha', async () => {
            (prisma as any).cartItem = {
                deleteMany: sinon.stub().rejects(new Error('Error')),
            };

            const result = await cartRepository.clearCart(999);

            expect(result).to.be.false;
        });
    });
});
