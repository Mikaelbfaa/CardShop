import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../src/database/prisma';
import productRepository from '../../src/repository/product';

describe('ProductRepository', () => {
    let originalProduct: any;

    beforeEach(() => {
        originalProduct = (prisma as any).product;
    });

    afterEach(() => {
        (prisma as any).product = originalProduct;
        sinon.restore();
    });

    describe('findAll', () => {
        it('deve retornar todos os produtos sem filtro', async () => {
            const products = [
                { id: 1, name: 'Dark Magician', game: 'yugioh' },
                { id: 2, name: 'Lightning Bolt', game: 'mtg' },
            ];

            (prisma as any).product = {
                findMany: sinon.stub().resolves(products),
            };

            const result = await productRepository.findAll();

            expect(result).to.be.an('array');
            expect(result).to.have.lengthOf(2);
        });

        it('deve filtrar por game', async () => {
            const products = [{ id: 1, name: 'Dark Magician', game: 'yugioh' }];

            (prisma as any).product = {
                findMany: sinon.stub().resolves(products),
            };

            const result = await productRepository.findAll({ game: 'yugioh' });

            expect(result).to.have.lengthOf(1);
        });

        it('deve filtrar por cardType', async () => {
            const products = [{ id: 1, name: 'Dark Magician', cardType: 'MONSTER' }];

            (prisma as any).product = {
                findMany: sinon.stub().resolves(products),
            };

            const result = await productRepository.findAll({ cardType: 'MONSTER' });

            expect(result).to.have.lengthOf(1);
        });
    });

    describe('findById', () => {
        it('deve retornar produto por ID (string)', async () => {
            const product = { id: 1, name: 'Dark Magician' };

            (prisma as any).product = {
                findUnique: sinon.stub().resolves(product),
            };

            const result = await productRepository.findById('1');

            expect(result).to.not.be.null;
            expect(result!.id).to.equal(1);
        });

        it('deve retornar null quando não encontrado', async () => {
            (prisma as any).product = {
                findUnique: sinon.stub().resolves(null),
            };

            const result = await productRepository.findById('999');

            expect(result).to.be.null;
        });
    });

    describe('findByName', () => {
        it('deve retornar produto por nome', async () => {
            const product = { id: 1, name: 'Dark Magician' };

            (prisma as any).product = {
                findFirst: sinon.stub().resolves(product),
            };

            const result = await productRepository.findByName('Dark Magician');

            expect(result).to.not.be.null;
            expect(result!.name).to.equal('Dark Magician');
        });

        it('deve retornar null quando não encontrado', async () => {
            (prisma as any).product = {
                findFirst: sinon.stub().resolves(null),
            };

            const result = await productRepository.findByName('Inexistente');

            expect(result).to.be.null;
        });
    });

    describe('create', () => {
        it('deve criar produto com sucesso', async () => {
            const productData = {
                name: 'Dark Magician',
                price: 29.99,
                stock: 10,
                game: 'yugioh' as const,
                cardType: 'MONSTER' as const,
            };

            const createdProduct = {
                id: 1,
                ...productData,
                description: null,
                rarity: null,
                image: null,
            };

            (prisma as any).product = {
                create: sinon.stub().resolves(createdProduct),
            };

            const result = await productRepository.create(productData);

            expect(result.id).to.equal(1);
            expect(result.name).to.equal('Dark Magician');
        });
    });

    describe('update', () => {
        it('deve atualizar produto com sucesso', async () => {
            const updatedProduct = { id: 1, name: 'Dark Magician', price: 39.99 };

            (prisma as any).product = {
                findUnique: sinon.stub().resolves({ id: 1 }),
                update: sinon.stub().resolves(updatedProduct),
            };

            const result = await productRepository.update('1', { price: 39.99 });

            expect(result).to.not.be.null;
            expect(result!.price).to.equal(39.99);
        });

        it('deve retornar null quando produto não existe', async () => {
            (prisma as any).product = {
                findUnique: sinon.stub().resolves(null),
            };

            const result = await productRepository.update('999', { price: 39.99 });

            expect(result).to.be.null;
        });
    });

    describe('delete', () => {
        it('deve deletar produto com sucesso', async () => {
            (prisma as any).product = {
                delete: sinon.stub().resolves({}),
            };

            await productRepository.delete('1');

            expect((prisma as any).product.delete.calledOnce).to.be.true;
        });
    });
});
