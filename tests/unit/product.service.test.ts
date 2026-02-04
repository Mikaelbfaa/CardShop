import { expect } from 'chai';
import sinon from 'sinon';
import productService from '../../src/services/product';
import productRepository from '../../src/repository/product';

describe('ProductService', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('getAllProducts', () => {
        it('deve retornar todos os produtos com filtros', async () => {
            const mockProducts = [
                {
                    id: 1,
                    name: 'Dark Magician',
                    description: 'Mago Negro',
                    price: 29.99,
                    stock: 10,
                    game: 'yugioh' as const,
                    cardType: 'MONSTER' as const,
                    rarity: 'Ultra Rare',
                    image: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    name: 'Blue-Eyes White Dragon',
                    description: 'Dragão Branco de Olhos Azuis',
                    price: 49.99,
                    stock: 5,
                    game: 'yugioh' as const,
                    cardType: 'MONSTER' as const,
                    rarity: 'Secret Rare',
                    image: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            sinon.stub(productRepository, 'findAll').resolves(mockProducts as any);

            const result = await productService.getAllProducts({ game: 'yugioh', cardType: 'MONSTER' });

            expect(result).to.be.an('array');
            expect(result).to.have.lengthOf(2);
            expect(result[0].name).to.equal('Dark Magician');
            expect(result[1].name).to.equal('Blue-Eyes White Dragon');
        });
    });

    describe('getProductById', () => {
        it('deve retornar produto por ID', async () => {
            const mockProduct = {
                id: 1,
                name: 'Dark Magician',
                description: 'Mago Negro',
                price: 29.99,
                stock: 10,
                game: 'yugioh' as const,
                cardType: 'MONSTER' as const,
                rarity: 'Ultra Rare',
                image: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            sinon.stub(productRepository, 'findById').resolves(mockProduct as any);

            const result = await productService.getProductById('1');

            expect(result).to.not.be.null;
            expect(result!.id).to.equal(1);
            expect(result!.name).to.equal('Dark Magician');
            expect(result!.game).to.equal('yugioh');
        });
    });

    describe('validateProductData', () => {
        it('deve aceitar dados válidos sem lançar erro', () => {
            const validProduct = {
                name: 'Dark Magician',
                price: 29.99,
                stock: 10,
                game: 'yugioh' as const,
                cardType: 'MONSTER' as const,
            };

            expect(() => productService.validateProductData(validProduct)).to.not.throw();
        });

        it('deve lançar erro quando campo obrigatório está faltando', () => {
            const invalidProduct = {
                name: 'Dark Magician',
                stock: 10,
                game: 'yugioh' as const,
            } as any;

            expect(() => productService.validateProductData(invalidProduct)).to.throw(
                'Campo price é obrigatório'
            );
        });

        it('deve lançar erro quando preço é negativo', () => {
            const invalidProduct = {
                name: 'Dark Magician',
                price: -5,
                stock: 10,
                game: 'yugioh' as const,
            };

            expect(() => productService.validateProductData(invalidProduct)).to.throw(
                'Preço não pode ser negativo'
            );
        });
    });

    describe('validateCardTypeForGame', () => {
        it('deve aceitar MONSTER como tipo válido para yugioh', () => {
            expect(() =>
                productService.validateCardTypeForGame('MONSTER' as any, 'yugioh')
            ).to.not.throw();
        });

        it('deve lançar erro quando CREATURE é usado para yugioh', () => {
            expect(() =>
                productService.validateCardTypeForGame('CREATURE' as any, 'yugioh')
            ).to.throw('Tipo de carta inválido para Yugioh');
        });
    });
});
