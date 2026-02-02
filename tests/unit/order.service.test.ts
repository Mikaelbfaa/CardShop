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
