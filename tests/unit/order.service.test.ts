import { expect } from 'chai';
import sinon from 'sinon';
import orderRepository from '../../src/repository/order';
import cartRepository from '../../src/repository/cart';
import prisma from '../../src/database/prisma';
import orderService from '../../src/services/order';

describe('OrderService', () => {
    let originalUser: any;

    beforeEach(() => {
        originalUser = (prisma as any).user;
    });

    afterEach(() => {
        (prisma as any).user = originalUser;
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
    });

    describe('createOrder', () => {
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
    });
});
