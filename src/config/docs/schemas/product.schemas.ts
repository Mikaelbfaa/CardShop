import { OpenAPIV3 } from 'openapi-types';

const GameEnum: OpenAPIV3.SchemaObject = {
    type: 'string',
    enum: ['mtg', 'yugioh'],
    description: 'Jogo de cartas colecionáveis',
};

const CardTypeEnum: OpenAPIV3.SchemaObject = {
    type: 'string',
    enum: [
        'MONSTER',
        'SPELL',
        'TRAP',
        'CREATURE',
        'INSTANT',
        'SORCERY',
        'ENCHANTMENT',
        'ARTIFACT',
        'LAND',
        'PLANESWALKER',
    ],
    description:
        'Tipo de carta. Yu-Gi-Oh!: MONSTER, SPELL, TRAP. MTG: CREATURE, INSTANT, SORCERY, ENCHANTMENT, ARTIFACT, LAND, PLANESWALKER',
};

export const Product: OpenAPIV3.SchemaObject = {
    type: 'object',
    properties: {
        id: {
            type: 'integer',
            description: 'ID único do produto',
        },
        name: {
            type: 'string',
            description: 'Nome da carta',
        },
        description: {
            type: 'string',
            nullable: true,
            description: 'Descrição da carta',
        },
        price: {
            type: 'number',
            format: 'decimal',
            description: 'Preço do produto em reais',
        },
        stock: {
            type: 'integer',
            description: 'Quantidade em estoque',
        },
        game: {
            ...GameEnum,
        },
        cardType: {
            ...CardTypeEnum,
            nullable: true,
        },
        rarity: {
            type: 'string',
            nullable: true,
            description: 'Raridade da carta (ex: Common, Rare, Ultra Rare)',
        },
        image: {
            type: 'string',
            nullable: true,
            description: 'URL da imagem da carta',
        },
        createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de criação do registro',
        },
        updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data da última atualização',
        },
    },
    required: ['id', 'name', 'price', 'stock', 'game', 'createdAt', 'updatedAt'],
};

export const CreateProduct: OpenAPIV3.SchemaObject = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            description: 'Nome da carta',
        },
        description: {
            type: 'string',
            description: 'Descrição da carta',
        },
        price: {
            type: 'number',
            description: 'Preço do produto em reais (deve ser >= 0)',
        },
        stock: {
            type: 'integer',
            description: 'Quantidade em estoque (deve ser >= 0)',
        },
        game: {
            ...GameEnum,
        },
        cardType: {
            ...CardTypeEnum,
        },
        rarity: {
            type: 'string',
            description: 'Raridade da carta',
        },
        image: {
            type: 'string',
            description: 'URL da imagem da carta',
        },
    },
    required: ['name', 'price', 'stock', 'game'],
};

export const UpdateProduct: OpenAPIV3.SchemaObject = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            description: 'Nome da carta',
        },
        description: {
            type: 'string',
            description: 'Descrição da carta',
        },
        price: {
            type: 'number',
            description: 'Preço do produto em reais (deve ser >= 0)',
        },
        stock: {
            type: 'integer',
            description: 'Quantidade em estoque (deve ser >= 0)',
        },
        game: {
            ...GameEnum,
        },
        cardType: {
            ...CardTypeEnum,
        },
        rarity: {
            type: 'string',
            description: 'Raridade da carta',
        },
        image: {
            type: 'string',
            description: 'URL da imagem da carta',
        },
    },
};

export const productSchemas = {
    Product,
    CreateProduct,
    UpdateProduct,
};
