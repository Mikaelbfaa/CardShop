import { expect } from 'chai';
import sinon from 'sinon';
import cartRepository from '../../src/repository/cart';
import prisma from '../../src/database/prisma';
import cartService from '../../src/services/cart';

describe('CartService', () => {
    let originalProduct: any;
    let originalUser: any;

    beforeEach(() => {
        originalProduct = (prisma as any).product;
        originalUser = (prisma as any).user;
    });

    afterEach(() => {
        (prisma as any).product = originalProduct;
        (prisma as any).user = originalUser;
        sinon.restore();
    });

    describe('addToCart', () => {
        it('deve lançar erro quando quantidade excede estoque ao adicionar item', async () => {
            const product = {
                id: 1,
                name: 'Dark Magician',
                price: 29.99,
                stock: 5,
                game: 'yugioh',
                cardType: 'MONSTER',
                description: null,
                imageUrl: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const user = {
                id: 1,
                email: 'teste@email.com',
                name: 'Teste',
                cpf: '12345678900',
                phone: null,
                address: null,
                role: 'CUSTOMER',
                password: 'hashed',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const cart = {
                id: 1,
                userId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                items: [],
            };

            const existingItem = {
                cartId: 1,
                productId: 1,
                quantity: 3,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma as any).product = { findUnique: sinon.stub().resolves(product) };
            (prisma as any).user = { findUnique: sinon.stub().resolves(user) };
            sinon.stub(cartRepository, 'findOrCreateByUserId').resolves(cart as any);
            sinon.stub(cartRepository, 'findCartItem').resolves(existingItem as any);

            try {
                await cartService.addToCart(1, { productId: 1, quantity: 5 });
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('Estoque insuficiente');
            }
        });

        it('deve lançar erro quando quantidade é menor que 1', async () => {
            try {
                await cartService.addToCart(1, { productId: 1, quantity: 0 });
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.equal(
                    'Erro ao adicionar ao carrinho: Quantidade deve ser no mínimo 1'
                );
            }
        });
    });
});
