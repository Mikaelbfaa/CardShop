import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../src/database/prisma';
import orderRepository from '../../src/repository/order';

describe('OrderRepository', () => {
    let originalOrder: any;

    beforeEach(() => {
        originalOrder = (prisma as any).order;
    });

    afterEach(() => {
        (prisma as any).order = originalOrder;
        sinon.restore();
    });

    describe('findAll', () => {
        it('deve retornar todos os pedidos sem filtro', async () => {
            const orders = [
                { id: 1, userId: 1, status: 'PENDING', items: [] },
                { id: 2, userId: 2, status: 'PROCESSING', items: [] },
            ];

            (prisma as any).order = {
                findMany: sinon.stub().resolves(orders),
            };

            const result = await orderRepository.findAll();

            expect(result).to.be.an('array');
            expect(result).to.have.lengthOf(2);
        });

        it('deve filtrar por status', async () => {
            const orders = [{ id: 1, userId: 1, status: 'PENDING', items: [] }];

            (prisma as any).order = {
                findMany: sinon.stub().resolves(orders),
            };

            const result = await orderRepository.findAll({ status: 'PENDING' });

            expect(result).to.have.lengthOf(1);
        });

        it('deve filtrar por userId', async () => {
            const orders = [{ id: 1, userId: 1, status: 'PENDING', items: [] }];

            (prisma as any).order = {
                findMany: sinon.stub().resolves(orders),
            };

            const result = await orderRepository.findAll({ userId: 1 });

            expect(result).to.have.lengthOf(1);
        });
    });

    describe('findById', () => {
        it('deve retornar pedido por ID', async () => {
            const order = {
                id: 1,
                userId: 1,
                status: 'PENDING',
                items: [{ productId: 1, quantity: 2 }],
            };

            (prisma as any).order = {
                findUnique: sinon.stub().resolves(order),
            };

            const result = await orderRepository.findById(1);

            expect(result).to.not.be.null;
            expect(result!.id).to.equal(1);
        });

        it('deve retornar null quando não encontrado', async () => {
            (prisma as any).order = {
                findUnique: sinon.stub().resolves(null),
            };

            const result = await orderRepository.findById(999);

            expect(result).to.be.null;
        });
    });

    describe('findByUserId', () => {
        it('deve retornar pedidos do usuário', async () => {
            const orders = [
                { id: 1, userId: 1, status: 'PENDING', items: [] },
                { id: 2, userId: 1, status: 'DELIVERED', items: [] },
            ];

            (prisma as any).order = {
                findMany: sinon.stub().resolves(orders),
            };

            const result = await orderRepository.findByUserId(1);

            expect(result).to.have.lengthOf(2);
        });

        it('deve retornar array vazio quando não há pedidos', async () => {
            (prisma as any).order = {
                findMany: sinon.stub().resolves([]),
            };

            const result = await orderRepository.findByUserId(999);

            expect(result).to.be.an('array');
            expect(result).to.have.lengthOf(0);
        });
    });

    describe('create', () => {
        it('deve criar pedido com itens', async () => {
            const orderData = {
                userId: 1,
                shippingAddress: 'Rua Teste, 123',
                totalPrice: 59.98,
                items: [
                    { productId: 1, quantity: 2, unitPrice: 29.99 },
                ],
            };

            const createdOrder = {
                id: 1,
                ...orderData,
                status: 'PENDING',
                items: [{ productId: 1, quantity: 2, unitPrice: 29.99, product: { id: 1 } }],
            };

            (prisma as any).order = {
                create: sinon.stub().resolves(createdOrder),
            };

            const result = await orderRepository.create(orderData);

            expect(result.id).to.equal(1);
            expect(result.items).to.have.lengthOf(1);
        });
    });

    describe('updateStatus', () => {
        it('deve atualizar status do pedido', async () => {
            const updatedOrder = {
                id: 1,
                userId: 1,
                status: 'PROCESSING',
                items: [],
            };

            (prisma as any).order = {
                findUnique: sinon.stub().resolves({ id: 1 }),
                update: sinon.stub().resolves(updatedOrder),
            };

            const result = await orderRepository.updateStatus(1, 'PROCESSING');

            expect(result).to.not.be.null;
            expect(result!.status).to.equal('PROCESSING');
        });

        it('deve retornar null quando pedido não existe', async () => {
            (prisma as any).order = {
                findUnique: sinon.stub().resolves(null),
            };

            const result = await orderRepository.updateStatus(999, 'PROCESSING');

            expect(result).to.be.null;
        });
    });

    describe('delete', () => {
        it('deve deletar pedido com sucesso', async () => {
            (prisma as any).order = {
                delete: sinon.stub().resolves({}),
            };

            await orderRepository.delete(1);

            expect((prisma as any).order.delete.calledOnce).to.be.true;
        });
    });
});
