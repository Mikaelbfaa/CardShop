import { expect } from 'chai';
import productService from '../../src/services/product';

describe('ProductService', () => {
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
