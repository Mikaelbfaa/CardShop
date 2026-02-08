import { expect } from 'chai';
import sinon from 'sinon';
import productService from '../../src/services/product';
import productRepository from '../../src/repository/product';

describe('ProductService', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('getAllProducts', () => {
        it('deve lançar erro quando repository falha', async () => {
            sinon.stub(productRepository, 'findAll').rejects(new Error('DB error'));

            try {
                await productService.getAllProducts();
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.equal('Erro ao buscar produtos: DB error');
            }
        });

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
        it('deve lançar erro quando productId não é fornecido', async () => {
            try {
                await productService.getProductById('');
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.equal(
                    'Erro ao buscar produto: ID do produto é obrigatório'
                );
            }
        });

        it('deve lançar erro quando repository falha', async () => {
            sinon.stub(productRepository, 'findById').rejects(new Error('DB error'));

            try {
                await productService.getProductById('1');
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.equal('Erro ao buscar produto: DB error');
            }
        });

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

    describe('createProduct', () => {
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
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            sinon.stub(productRepository, 'findByName').resolves(null);
            sinon.stub(productRepository, 'create').resolves(createdProduct as any);

            const result = await productService.createProduct(productData);

            expect(result.id).to.equal(1);
            expect(result.name).to.equal('Dark Magician');
        });

        it('deve lançar erro quando nome duplicado', async () => {
            const productData = {
                name: 'Dark Magician',
                price: 29.99,
                stock: 10,
                game: 'yugioh' as const,
            };

            sinon.stub(productRepository, 'findByName').resolves({ id: 1 } as any);

            try {
                await productService.createProduct(productData);
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('Já existe um produto com este nome');
            }
        });

        it('deve lançar erro quando validação falha', async () => {
            try {
                await productService.createProduct({ name: 'Test' } as any);
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('Erro ao criar produto');
            }
        });
    });

    describe('updateProduct', () => {
        it('deve atualizar produto com sucesso', async () => {
            const existingProduct = {
                id: 1,
                name: 'Dark Magician',
                description: null,
                price: 29.99,
                stock: 10,
                game: 'yugioh' as const,
                cardType: 'MONSTER' as const,
                rarity: null,
                image: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const updatedProduct = { ...existingProduct, price: 39.99 };

            sinon.stub(productRepository, 'findById').resolves(existingProduct as any);
            sinon.stub(productRepository, 'update').resolves(updatedProduct as any);

            const result = await productService.updateProduct('1', { price: 39.99 });

            expect(result).to.not.be.null;
            expect(result!.price).to.equal(39.99);
        });

        it('deve retornar null quando produto não existe', async () => {
            sinon.stub(productRepository, 'findById').resolves(null);

            const result = await productService.updateProduct('999', { price: 39.99 });

            expect(result).to.be.null;
        });

        it('deve lançar erro quando dados de atualização estão vazios', async () => {
            try {
                await productService.updateProduct('1', {});
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('Dados de atualização são obrigatórios');
            }
        });

        it('deve lançar erro quando preço é negativo', async () => {
            sinon.stub(productRepository, 'findById').resolves({ id: 1, game: 'yugioh' } as any);

            try {
                await productService.updateProduct('1', { price: -5 });
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('Preço não pode ser negativo');
            }
        });

        it('deve lançar erro quando estoque é negativo', async () => {
            sinon.stub(productRepository, 'findById').resolves({ id: 1, game: 'yugioh' } as any);

            try {
                await productService.updateProduct('1', { stock: -1 });
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('Estoque não pode ser negativo');
            }
        });

        it('deve validar cardType ao atualizar', async () => {
            sinon.stub(productRepository, 'findById').resolves({
                id: 1,
                game: 'yugioh',
                cardType: 'MONSTER',
            } as any);

            try {
                await productService.updateProduct('1', { cardType: 'CREATURE' as any });
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('Tipo de carta inválido para Yugioh');
            }
        });
    });

    describe('deleteProduct', () => {
        it('deve deletar produto com sucesso', async () => {
            sinon.stub(productRepository, 'findById').resolves({ id: 1 } as any);
            sinon.stub(productRepository, 'delete').resolves();

            const result = await productService.deleteProduct('1');

            expect(result).to.be.true;
        });

        it('deve retornar null quando produto não existe', async () => {
            sinon.stub(productRepository, 'findById').resolves(null);

            const result = await productService.deleteProduct('999');

            expect(result).to.be.null;
        });

        it('deve lançar erro de foreign key quando produto está em uso', async () => {
            sinon.stub(productRepository, 'findById').resolves({ id: 1 } as any);
            sinon.stub(productRepository, 'delete').rejects(new Error('Foreign key constraint'));

            try {
                await productService.deleteProduct('1');
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('em uso');
            }
        });

        it('deve lançar erro genérico quando delete falha', async () => {
            sinon.stub(productRepository, 'findById').resolves({ id: 1 } as any);
            sinon.stub(productRepository, 'delete').rejects(new Error('Unknown error'));

            try {
                await productService.deleteProduct('1');
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.include('Erro ao deletar produto');
            }
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

        it('deve lançar erro quando estoque é negativo', () => {
            const invalidProduct = {
                name: 'Dark Magician',
                price: 10,
                stock: -1,
                game: 'yugioh' as const,
            };

            expect(() => productService.validateProductData(invalidProduct)).to.throw(
                'Estoque não pode ser negativo'
            );
        });

        it('deve lançar erro quando jogo é inválido', () => {
            const invalidProduct = {
                name: 'Dark Magician',
                price: 10,
                stock: 5,
                game: 'pokemon' as any,
            };

            expect(() => productService.validateProductData(invalidProduct)).to.throw(
                'Jogo inválido. Opções: mtg, yugioh'
            );
        });

        it('deve lançar erro quando name está faltando', () => {
            const invalidProduct = {
                price: 10,
                stock: 5,
                game: 'yugioh' as const,
            } as any;

            expect(() => productService.validateProductData(invalidProduct)).to.throw(
                'Campo name é obrigatório'
            );
        });

        it('deve lançar erro quando stock está faltando', () => {
            const invalidProduct = {
                name: 'Test',
                price: 10,
                game: 'yugioh' as const,
            } as any;

            expect(() => productService.validateProductData(invalidProduct)).to.throw(
                'Campo stock é obrigatório'
            );
        });

        it('deve lançar erro quando game está faltando', () => {
            const invalidProduct = {
                name: 'Test',
                price: 10,
                stock: 5,
            } as any;

            expect(() => productService.validateProductData(invalidProduct)).to.throw(
                'Campo game é obrigatório'
            );
        });

        it('deve validar cardType quando fornecido', () => {
            const productWithCardType = {
                name: 'Dark Magician',
                price: 10,
                stock: 5,
                game: 'yugioh' as const,
                cardType: 'MONSTER' as const,
            };

            expect(() => productService.validateProductData(productWithCardType)).to.not.throw();
        });
    });

    describe('validateCardTypeForGame', () => {
        it('deve aceitar MONSTER como tipo válido para yugioh', () => {
            expect(() =>
                productService.validateCardTypeForGame('MONSTER' as any, 'yugioh')
            ).to.not.throw();
        });

        it('deve aceitar SPELL como tipo válido para yugioh', () => {
            expect(() =>
                productService.validateCardTypeForGame('SPELL' as any, 'yugioh')
            ).to.not.throw();
        });

        it('deve aceitar TRAP como tipo válido para yugioh', () => {
            expect(() =>
                productService.validateCardTypeForGame('TRAP' as any, 'yugioh')
            ).to.not.throw();
        });

        it('deve aceitar CREATURE como tipo válido para mtg', () => {
            expect(() =>
                productService.validateCardTypeForGame('CREATURE' as any, 'mtg')
            ).to.not.throw();
        });

        it('deve aceitar INSTANT como tipo válido para mtg', () => {
            expect(() =>
                productService.validateCardTypeForGame('INSTANT' as any, 'mtg')
            ).to.not.throw();
        });

        it('deve aceitar PLANESWALKER como tipo válido para mtg', () => {
            expect(() =>
                productService.validateCardTypeForGame('PLANESWALKER' as any, 'mtg')
            ).to.not.throw();
        });

        it('deve lançar erro quando CREATURE é usado para yugioh', () => {
            expect(() =>
                productService.validateCardTypeForGame('CREATURE' as any, 'yugioh')
            ).to.throw('Tipo de carta inválido para Yugioh');
        });

        it('deve lançar erro quando MONSTER é usado para mtg', () => {
            expect(() =>
                productService.validateCardTypeForGame('MONSTER' as any, 'mtg')
            ).to.throw('Tipo de carta inválido para Magic the Gathering');
        });
    });
});
