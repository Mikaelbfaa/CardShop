import { expect } from 'chai';
import sinon from 'sinon';
import orderRepository from '../../src/repository/order';
import cartRepository from '../../src/repository/cart';
import prisma from '../../src/database/prisma';
import orderService from '../../src/services/order';

describe('OrderService', () => {
    let originalUser: any;
    let originalTransaction: any;

    beforeEach(() => {
        originalUser = (prisma as any).user;
        originalTransaction = (prisma as any).$transaction;
    });

    afterEach(() => {
        (prisma as any).user = originalUser;
        if (originalTransaction) {
            (prisma as any).$transaction = originalTransaction;
        }
        sinon.restore();
    });

    describe('getAllOrders', () => {
        it('deve retornar todos os pedidos com filtro de status', async () => {
            const mockOrders = [
                {
                    id: 1,
                    userId: 1,
                    status: 'PENDING' as const,
                    shippingAddress: 'Rua A, 123',
                    totalPrice: 100,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    items: [],
                },
                {
                    id: 2,
                    userId: 2,
                    status: 'PENDING' as const,
                    shippingAddress: 'Rua B, 456',
                    totalPrice: 200,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    items: [],
                },
            ];

            sinon.stub(orderRepository, 'findAll').resolves(mockOrders as any);

            const result = await orderService.getAllOrders({ status: 'PENDING' });

            expect(result).to.be.an('array');
            expect(result).to.have.lengthOf(2);
            expect(result[0].status).to.equal('PENDING');
            expect(result[1].status).to.equal('PENDING');
        });

        it('deve lançar erro quando repository falha', async () => {
            sinon.stub(orderRepository, 'findAll').rejects(new Error('DB error'));

            try {
                await orderService.getAllOrders();
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.equal('Erro ao buscar pedidos: DB error');
            }
        });
    });

    describe('getOrderById', () => {
        it('deve retornar pedido por ID', async () => {
            const mockOrder = {
                id: 1,
                userId: 1,
                status: 'PENDING' as const,
                shippingAddress: 'Rua Teste, 123',
                totalPrice: 150.5,
                createdAt: new Date(),
                updatedAt: new Date(),
                items: [
                    {
                        orderId: 1,
                        productId: 1,
                        quantity: 2,
                        unitPrice: 75.25,
                        product: {
                            id: 1,
                            name: 'Dark Magician',
                        },
                    },
                ],
            };

            sinon.stub(orderRepository, 'findById').resolves(mockOrder as any);

            const result = await orderService.getOrderById(1);

            expect(result).to.not.be.null;
            expect(result!.id).to.equal(1);
            expect(result!.status).to.equal('PENDING');
            expect(result!.totalPrice).to.equal(150.5);
            expect(result!.items).to.have.lengthOf(1);
        });

        it('deve lançar erro quando orderId não é fornecido', async () => {
            try {
                await orderService.getOrderById(0);
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.equal(
                    'Erro ao buscar pedido: orderId é obrigatório'
                );
            }
        });
    });

    describe('getOrdersByUser', () => {
        it('deve retornar pedidos do usuário com sucesso', async () => {
            const user = { id: 1, email: 'test@test.com', name: 'Test' };
            const mockOrders = [
                { id: 1, userId: 1, status: 'PENDING', items: [] },
            ];

            (prisma as any).user = { findUnique: sinon.stub().resolves(user) };
            sinon.stub(orderRepository, 'findByUserId').resolves(mockOrders as any);

            const result = await orderService.getOrdersByUser(1);

            expect(result).to.be.an('array');
            expect(result).to.have.lengthOf(1);
        });

        it('deve lançar erro quando userId não é fornecido', async () => {
            try {
                await orderService.getOrdersByUser(0);
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.equal(
                    'Erro ao buscar pedidos: userId é obrigatório'
                );
            }
        });

        it('deve lançar erro quando usuário não existe', async () => {
            (prisma as any).user = { findUnique: sinon.stub().resolves(null) };

            try {
                await orderService.getOrdersByUser(999);
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('Usuário não encontrado');
            }
        });
    });

    describe('createOrder', () => {
        it('deve criar pedido com sucesso', async () => {
            const user = { id: 1, email: 'test@test.com', name: 'Test' };
            const cart = {
                id: 1,
                userId: 1,
                items: [
                    {
                        productId: 1,
                        quantity: 2,
                        product: { id: 1, name: 'Dark Magician', price: 29.99, stock: 10 },
                    },
                ],
            };

            const createdOrder = {
                id: 1,
                userId: 1,
                status: 'PENDING',
                shippingAddress: 'Rua Teste, 123',
                totalPrice: 59.98,
                items: cart.items,
            };

            (prisma as any).user = { findUnique: sinon.stub().resolves(user) };
            sinon.stub(cartRepository, 'findByUserId').resolves(cart as any);
            (prisma as any).$transaction = sinon.stub().callsFake(async (fn: any) => {
                const tx = {
                    order: {
                        create: sinon.stub().resolves(createdOrder),
                    },
                    product: {
                        update: sinon.stub().resolves({}),
                    },
                    cartItem: {
                        deleteMany: sinon.stub().resolves({}),
                    },
                };
                return fn(tx);
            });

            const result = await orderService.createOrder(1, 'Rua Teste, 123');

            expect(result).to.not.be.null;
            expect(result.id).to.equal(1);
        });

        it('deve lançar erro quando userId não é fornecido', async () => {
            try {
                await orderService.createOrder(0, 'Rua Teste, 123');
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.equal(
                    'Erro ao criar pedido: userId é obrigatório'
                );
            }
        });

        it('deve lançar erro quando shippingAddress não é fornecido', async () => {
            try {
                await orderService.createOrder(1, '');
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.equal(
                    'Erro ao criar pedido: Endereço de entrega é obrigatório'
                );
            }
        });

        it('deve lançar erro quando shippingAddress é apenas espaços', async () => {
            try {
                await orderService.createOrder(1, '   ');
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('Endereço de entrega é obrigatório');
            }
        });

        it('deve lançar erro quando usuário não existe', async () => {
            (prisma as any).user = { findUnique: sinon.stub().resolves(null) };

            try {
                await orderService.createOrder(999, 'Rua Teste, 123');
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('Usuário não encontrado');
            }
        });

        it('deve lançar erro ao criar pedido com carrinho vazio', async () => {
            const user = {
                id: 1,
                email: 'teste@email.com',
                name: 'Teste',
                cpf: '12345678900',
                phone: null,
                address: null,
                role: 'CUSTOMER' as const,
                password: 'hashed',
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

            (prisma as any).user = { findUnique: sinon.stub().resolves(user) };
            sinon.stub(cartRepository, 'findByUserId').resolves(emptyCart as any);

            try {
                await orderService.createOrder(1, 'Rua Teste, 123');
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.equal(
                    'Erro ao criar pedido: Carrinho está vazio'
                );
            }
        });

        it('deve lançar erro quando carrinho é null', async () => {
            const user = { id: 1, email: 'test@test.com', name: 'Test' };

            (prisma as any).user = { findUnique: sinon.stub().resolves(user) };
            sinon.stub(cartRepository, 'findByUserId').resolves(null);

            try {
                await orderService.createOrder(1, 'Rua Teste, 123');
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('Carrinho está vazio');
            }
        });

        it('deve lançar erro quando estoque é insuficiente', async () => {
            const user = { id: 1, email: 'test@test.com', name: 'Test' };
            const cart = {
                id: 1,
                userId: 1,
                items: [
                    {
                        productId: 1,
                        quantity: 20,
                        product: { id: 1, name: 'Dark Magician', price: 29.99, stock: 5 },
                    },
                ],
            };

            (prisma as any).user = { findUnique: sinon.stub().resolves(user) };
            sinon.stub(cartRepository, 'findByUserId').resolves(cart as any);

            try {
                await orderService.createOrder(1, 'Rua Teste, 123');
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('Estoque insuficiente');
            }
        });
    });

    describe('updateOrderStatus', () => {
        it('deve permitir transição PENDING para PROCESSING', async () => {
            const pendingOrder = {
                id: 1,
                userId: 1,
                status: 'PENDING' as const,
                shippingAddress: 'Rua Teste, 123',
                totalPrice: 100,
                createdAt: new Date(),
                updatedAt: new Date(),
                items: [],
            };

            const updatedOrder = {
                ...pendingOrder,
                status: 'PROCESSING' as const,
            };

            sinon.stub(orderRepository, 'findById').resolves(pendingOrder as any);
            sinon.stub(orderRepository, 'updateStatus').resolves(updatedOrder as any);

            const result = await orderService.updateOrderStatus(1, 'PROCESSING');

            expect(result.status).to.equal('PROCESSING');
        });

        it('deve permitir transição PROCESSING para SHIPPED', async () => {
            const order = {
                id: 1,
                userId: 1,
                status: 'PROCESSING' as const,
                shippingAddress: 'Rua Teste',
                totalPrice: 100,
                items: [],
            };

            const updatedOrder = { ...order, status: 'SHIPPED' as const };

            sinon.stub(orderRepository, 'findById').resolves(order as any);
            sinon.stub(orderRepository, 'updateStatus').resolves(updatedOrder as any);

            const result = await orderService.updateOrderStatus(1, 'SHIPPED');

            expect(result.status).to.equal('SHIPPED');
        });

        it('deve permitir transição PENDING para CANCELLED', async () => {
            const order = {
                id: 1,
                userId: 1,
                status: 'PENDING' as const,
                shippingAddress: 'Rua Teste',
                totalPrice: 100,
                items: [],
            };

            const updatedOrder = { ...order, status: 'CANCELLED' as const };

            sinon.stub(orderRepository, 'findById').resolves(order as any);
            sinon.stub(orderRepository, 'updateStatus').resolves(updatedOrder as any);

            const result = await orderService.updateOrderStatus(1, 'CANCELLED');

            expect(result.status).to.equal('CANCELLED');
        });

        it('deve lançar erro quando orderId não é fornecido', async () => {
            try {
                await orderService.updateOrderStatus(0, 'PROCESSING');
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.equal(
                    'Erro ao atualizar status: orderId é obrigatório'
                );
            }
        });

        it('deve lançar erro quando status não é fornecido', async () => {
            try {
                await orderService.updateOrderStatus(1, '' as any);
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.equal(
                    'Erro ao atualizar status: status é obrigatório'
                );
            }
        });

        it('deve lançar erro quando status é inválido', async () => {
            try {
                await orderService.updateOrderStatus(1, 'INVALID' as any);
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('Status inválido');
            }
        });

        it('deve lançar erro quando pedido não é encontrado', async () => {
            sinon.stub(orderRepository, 'findById').resolves(null);

            try {
                await orderService.updateOrderStatus(1, 'PROCESSING');
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('Pedido não encontrado');
            }
        });

        it('deve rejeitar transição DELIVERED para CANCELLED', async () => {
            const deliveredOrder = {
                id: 1,
                userId: 1,
                status: 'DELIVERED' as const,
                shippingAddress: 'Rua Teste, 123',
                totalPrice: 100,
                createdAt: new Date(),
                updatedAt: new Date(),
                items: [],
            };

            sinon.stub(orderRepository, 'findById').resolves(deliveredOrder as any);

            try {
                await orderService.updateOrderStatus(1, 'CANCELLED');
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include(
                    'Transição inválida: DELIVERED → CANCELLED. Permitidas: nenhuma'
                );
            }
        });

        it('deve rejeitar transição SHIPPED para CANCELLED', async () => {
            const shippedOrder = {
                id: 1,
                userId: 1,
                status: 'SHIPPED' as const,
                shippingAddress: 'Rua Teste, 123',
                totalPrice: 100,
                createdAt: new Date(),
                updatedAt: new Date(),
                items: [],
            };

            sinon.stub(orderRepository, 'findById').resolves(shippedOrder as any);

            try {
                await orderService.updateOrderStatus(1, 'CANCELLED');
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include(
                    'Transição inválida: SHIPPED → CANCELLED. Permitidas: DELIVERED'
                );
            }
        });

        it('deve lançar erro quando updateStatus retorna null', async () => {
            const order = {
                id: 1,
                userId: 1,
                status: 'PENDING' as const,
                shippingAddress: 'Rua Teste',
                totalPrice: 100,
                items: [],
            };

            sinon.stub(orderRepository, 'findById').resolves(order as any);
            sinon.stub(orderRepository, 'updateStatus').resolves(null);

            try {
                await orderService.updateOrderStatus(1, 'PROCESSING');
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('Erro ao atualizar pedido');
            }
        });
    });

    describe('deleteOrder', () => {
        it('deve deletar pedido com sucesso', async () => {
            sinon.stub(orderRepository, 'findById').resolves({ id: 1 } as any);
            sinon.stub(orderRepository, 'delete').resolves();

            const result = await orderService.deleteOrder(1);

            expect(result).to.be.true;
        });

        it('deve retornar false quando pedido não é encontrado', async () => {
            sinon.stub(orderRepository, 'findById').resolves(null);

            const result = await orderService.deleteOrder(999);

            expect(result).to.be.false;
        });

        it('deve lançar erro quando orderId não é fornecido', async () => {
            try {
                await orderService.deleteOrder(0);
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.equal(
                    'Erro ao deletar pedido: orderId é obrigatório'
                );
            }
        });
    });
});
