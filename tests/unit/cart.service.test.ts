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

    describe('getCart', () => {
        it('deve retornar carrinho do usuário', async () => {
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
                items: [
                    {
                        cartId: 1,
                        productId: 1,
                        quantity: 2,
                        product: {
                            id: 1,
                            name: 'Dark Magician',
                            price: 29.99,
                            stock: 10,
                        },
                    },
                ],
            };

            (prisma as any).user = { findUnique: sinon.stub().resolves(user) };
            sinon.stub(cartRepository, 'findOrCreateByUserId').resolves(cart as any);

            const result = await cartService.getCart(1);

            expect(result).to.not.be.null;
            expect(result.id).to.equal(1);
            expect(result.userId).to.equal(1);
            expect(result.items).to.be.an('array');
            expect(result.items).to.have.lengthOf(1);
            expect(result.items[0].quantity).to.equal(2);
        });
    });

    describe('removeFromCart', () => {
        it('deve remover item do carrinho com sucesso', async () => {
            const cart = {
                id: 1,
                userId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                items: [
                    {
                        cartId: 1,
                        productId: 1,
                        quantity: 2,
                        product: {
                            id: 1,
                            name: 'Dark Magician',
                            price: 29.99,
                            stock: 10,
                        },
                    },
                ],
            };

            const existingItem = {
                cartId: 1,
                productId: 1,
                quantity: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const emptyCart = {
                id: 1,
                userId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                items: [],
            };

            sinon.stub(cartRepository, 'findByUserId').resolves(cart as any);
            sinon.stub(cartRepository, 'findCartItem').resolves(existingItem as any);
            sinon.stub(cartRepository, 'removeItem').resolves();
            sinon.stub(cartRepository, 'findOrCreateByUserId').resolves(emptyCart as any);

            const result = await cartService.removeFromCart(1, 1);

            expect(result).to.not.be.null;
            expect(result.items).to.be.an('array');
            expect(result.items).to.have.lengthOf(0);
        });
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
