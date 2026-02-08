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

        it('deve lançar erro quando userId não é fornecido', async () => {
            try {
                await cartService.getCart(0);
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.equal(
                    'Erro ao buscar carrinho: userId é obrigatório'
                );
            }
        });

        it('deve lançar erro quando usuário não existe', async () => {
            (prisma as any).user = { findUnique: sinon.stub().resolves(null) };

            try {
                await cartService.getCart(999);
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('Usuário não encontrado');
            }
        });
    });

    describe('addToCart', () => {
        it('deve adicionar novo item ao carrinho com sucesso', async () => {
            const product = {
                id: 1,
                name: 'Dark Magician',
                price: 29.99,
                stock: 10,
            };

            const user = {
                id: 1,
                email: 'teste@email.com',
                name: 'Teste',
                cpf: '12345678900',
                password: 'hashed',
            };

            const cart = {
                id: 1,
                userId: 1,
                items: [],
            };

            const updatedCart = {
                id: 1,
                userId: 1,
                items: [{ cartId: 1, productId: 1, quantity: 2, product }],
            };

            (prisma as any).product = { findUnique: sinon.stub().resolves(product) };
            (prisma as any).user = { findUnique: sinon.stub().resolves(user) };
            const findOrCreateStub = sinon.stub(cartRepository, 'findOrCreateByUserId');
            findOrCreateStub.onFirstCall().resolves(cart as any);
            findOrCreateStub.onSecondCall().resolves(updatedCart as any);
            sinon.stub(cartRepository, 'findCartItem').resolves(null);
            sinon.stub(cartRepository, 'addItem').resolves({} as any);

            const result = await cartService.addToCart(1, { productId: 1, quantity: 2 });

            expect(result.items).to.have.lengthOf(1);
        });

        it('deve atualizar item existente no carrinho', async () => {
            const product = {
                id: 1,
                name: 'Dark Magician',
                price: 29.99,
                stock: 10,
            };

            const user = { id: 1, email: 'test@test.com', name: 'Test', cpf: '123', password: 'h' };

            const cart = { id: 1, userId: 1, items: [] };

            const existingItem = { cartId: 1, productId: 1, quantity: 2 };

            const updatedCart = {
                id: 1,
                userId: 1,
                items: [{ cartId: 1, productId: 1, quantity: 4, product }],
            };

            (prisma as any).product = { findUnique: sinon.stub().resolves(product) };
            (prisma as any).user = { findUnique: sinon.stub().resolves(user) };
            const findOrCreateStub = sinon.stub(cartRepository, 'findOrCreateByUserId');
            findOrCreateStub.onFirstCall().resolves(cart as any);
            findOrCreateStub.onSecondCall().resolves(updatedCart as any);
            sinon.stub(cartRepository, 'findCartItem').resolves(existingItem as any);
            sinon.stub(cartRepository, 'updateItemQuantity').resolves({} as any);

            const result = await cartService.addToCart(1, { productId: 1, quantity: 2 });

            expect(result.items[0].quantity).to.equal(4);
        });

        it('deve lançar erro quando userId não é fornecido', async () => {
            try {
                await cartService.addToCart(0, { productId: 1, quantity: 1 });
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.equal(
                    'Erro ao adicionar ao carrinho: userId é obrigatório'
                );
            }
        });

        it('deve lançar erro quando productId não é fornecido', async () => {
            try {
                await cartService.addToCart(1, { productId: 0, quantity: 1 });
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.equal(
                    'Erro ao adicionar ao carrinho: productId é obrigatório'
                );
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

        it('deve lançar erro quando produto não existe', async () => {
            (prisma as any).product = { findUnique: sinon.stub().resolves(null) };

            try {
                await cartService.addToCart(1, { productId: 999, quantity: 1 });
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('Produto não encontrado');
            }
        });

        it('deve lançar erro quando usuário não existe', async () => {
            (prisma as any).product = { findUnique: sinon.stub().resolves({ id: 1, stock: 10 }) };
            (prisma as any).user = { findUnique: sinon.stub().resolves(null) };

            try {
                await cartService.addToCart(999, { productId: 1, quantity: 1 });
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('Usuário não encontrado');
            }
        });

        it('deve lançar erro quando quantidade excede estoque ao adicionar item', async () => {
            const product = {
                id: 1,
                name: 'Dark Magician',
                price: 29.99,
                stock: 5,
            };

            const user = { id: 1, email: 'test@test.com', name: 'Test', cpf: '123', password: 'h' };

            const cart = { id: 1, userId: 1, items: [] };

            const existingItem = { cartId: 1, productId: 1, quantity: 3 };

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
    });

    describe('updateQuantity', () => {
        it('deve atualizar quantidade com sucesso', async () => {
            const cart = { id: 1, userId: 1, items: [] };
            const existingItem = { cartId: 1, productId: 1, quantity: 2 };
            const product = { id: 1, stock: 10 };
            const updatedCart = {
                id: 1,
                userId: 1,
                items: [{ cartId: 1, productId: 1, quantity: 5, product }],
            };

            sinon.stub(cartRepository, 'findByUserId').resolves(cart as any);
            sinon.stub(cartRepository, 'findCartItem').resolves(existingItem as any);
            (prisma as any).product = { findUnique: sinon.stub().resolves(product) };
            sinon.stub(cartRepository, 'updateItemQuantity').resolves({} as any);
            sinon.stub(cartRepository, 'findOrCreateByUserId').resolves(updatedCart as any);

            const result = await cartService.updateQuantity(1, 1, 5);

            expect(result.items[0].quantity).to.equal(5);
        });

        it('deve lançar erro quando userId não é fornecido', async () => {
            try {
                await cartService.updateQuantity(0, 1, 1);
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.equal(
                    'Erro ao atualizar quantidade: userId é obrigatório'
                );
            }
        });

        it('deve lançar erro quando productId não é fornecido', async () => {
            try {
                await cartService.updateQuantity(1, 0, 1);
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.equal(
                    'Erro ao atualizar quantidade: productId é obrigatório'
                );
            }
        });

        it('deve lançar erro quando quantity é menor que 1', async () => {
            try {
                await cartService.updateQuantity(1, 1, 0);
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.equal(
                    'Erro ao atualizar quantidade: Quantidade deve ser no mínimo 1'
                );
            }
        });

        it('deve lançar erro quando carrinho não é encontrado', async () => {
            sinon.stub(cartRepository, 'findByUserId').resolves(null);

            try {
                await cartService.updateQuantity(1, 1, 2);
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('Carrinho não encontrado');
            }
        });

        it('deve lançar erro quando item não está no carrinho', async () => {
            sinon.stub(cartRepository, 'findByUserId').resolves({ id: 1 } as any);
            sinon.stub(cartRepository, 'findCartItem').resolves(null);

            try {
                await cartService.updateQuantity(1, 1, 2);
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('Item não encontrado no carrinho');
            }
        });

        it('deve lançar erro quando produto não é encontrado', async () => {
            sinon.stub(cartRepository, 'findByUserId').resolves({ id: 1 } as any);
            sinon.stub(cartRepository, 'findCartItem').resolves({ cartId: 1, productId: 1 } as any);
            (prisma as any).product = { findUnique: sinon.stub().resolves(null) };

            try {
                await cartService.updateQuantity(1, 1, 2);
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('Produto não encontrado');
            }
        });

        it('deve lançar erro quando estoque é insuficiente', async () => {
            sinon.stub(cartRepository, 'findByUserId').resolves({ id: 1 } as any);
            sinon.stub(cartRepository, 'findCartItem').resolves({ cartId: 1, productId: 1 } as any);
            (prisma as any).product = { findUnique: sinon.stub().resolves({ id: 1, stock: 3 }) };

            try {
                await cartService.updateQuantity(1, 1, 5);
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('Estoque insuficiente');
            }
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

        it('deve lançar erro quando userId não é fornecido', async () => {
            try {
                await cartService.removeFromCart(0, 1);
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.equal(
                    'Erro ao remover item: userId é obrigatório'
                );
            }
        });

        it('deve lançar erro quando productId não é fornecido', async () => {
            try {
                await cartService.removeFromCart(1, 0);
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.equal(
                    'Erro ao remover item: productId é obrigatório'
                );
            }
        });

        it('deve lançar erro quando carrinho não é encontrado', async () => {
            sinon.stub(cartRepository, 'findByUserId').resolves(null);

            try {
                await cartService.removeFromCart(1, 1);
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('Carrinho não encontrado');
            }
        });

        it('deve lançar erro quando item não está no carrinho', async () => {
            sinon.stub(cartRepository, 'findByUserId').resolves({ id: 1 } as any);
            sinon.stub(cartRepository, 'findCartItem').resolves(null);

            try {
                await cartService.removeFromCart(1, 1);
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('Item não encontrado no carrinho');
            }
        });
    });

    describe('clearCart', () => {
        it('deve limpar carrinho com sucesso', async () => {
            const cart = { id: 1, userId: 1, items: [{ productId: 1 }] };
            const emptyCart = { id: 1, userId: 1, items: [] };

            sinon.stub(cartRepository, 'findByUserId').resolves(cart as any);
            sinon.stub(cartRepository, 'clearCart').resolves(true);
            sinon.stub(cartRepository, 'findOrCreateByUserId').resolves(emptyCart as any);

            const result = await cartService.clearCart(1);

            expect(result.items).to.have.lengthOf(0);
        });

        it('deve lançar erro quando userId não é fornecido', async () => {
            try {
                await cartService.clearCart(0);
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.equal(
                    'Erro ao limpar carrinho: userId é obrigatório'
                );
            }
        });

        it('deve lançar erro quando carrinho não é encontrado', async () => {
            sinon.stub(cartRepository, 'findByUserId').resolves(null);

            try {
                await cartService.clearCart(1);
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('Carrinho não encontrado');
            }
        });
    });
});
