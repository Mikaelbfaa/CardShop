import { CartItem, FilterType, Order, OrderStatus, Product } from './types';

export const FILTER_OPTIONS: { label: FilterType; cardType: string | null }[] = [
    { label: 'TODOS', cardType: null },
    { label: 'MONSTROS', cardType: 'MONSTER' },
    { label: 'MAGIAS', cardType: 'SPELL' },
    { label: 'ARMADILHAS', cardType: 'TRAP' },
    { label: 'TERRENOS', cardType: 'LAND' },
    { label: 'CRIATURAS', cardType: 'CREATURE' },
];

export const MOCK_PRODUCTS: Product[] = [
    {
        id: 1,
        name: 'The Wandering Emperor',
        description: 'Planeswalker lendária de Magic: The Gathering.',
        price: 89.9,
        image: '/images/cards/miniatures/the-wandering-emperor.jpg',
        fullImage: '/images/cards/full/the-wandering-emperor.jpg',
        game: 'mtg',
        cardType: 'CREATURE',
        rarity: 'Mythic Rare',
        stock: 4,
        badge: 'NOVO',
    },
    {
        id: 2,
        name: 'Gift of Orzhova',
        description: 'Encantamento clássico do clã Orzhov.',
        price: 12.5,
        oldPrice: 25.0,
        image: '/images/cards/miniatures/gift-of-orzhova.jpg',
        fullImage: '/images/cards/full/gift-of-orzhova.jpg',
        game: 'mtg',
        cardType: 'SPELL',
        rarity: 'Uncommon',
        stock: 15,
        badge: 'PROMO',
    },
    {
        id: 3,
        name: 'Path of Exile',
        description: 'Carta ilustrada com arte exclusiva.',
        price: 45.0,
        image: '/images/cards/miniatures/poe.jpg',
        fullImage: '/images/cards/full/poe.jpg',
        game: 'mtg',
        cardType: 'CREATURE',
        rarity: 'Rare',
        stock: 7,
    },
    {
        id: 4,
        name: 'Sword of Feast and Famine',
        description: 'Artefato poderoso de equipamento.',
        price: 120.0,
        image: '/images/cards/miniatures/sword-of-feast.jpg',
        fullImage: '/images/cards/full/sword-of-feast.jpg',
        game: 'mtg',
        cardType: 'TRAP',
        rarity: 'Mythic Rare',
        stock: 3,
    },
    {
        id: 5,
        name: 'Blue-Eyes Chaos Dragon',
        description:
            'Esta carta não pode ser invocada por invocação normal ou setada. Deve ser invocada especialmente (da sua mão) banindo 1 monstro de LUZ e 1 monstro de TREVAS do seu cemitério. Uma vez por turno: você pode escolher 1 monstro virado para cima no campo; bana esse alvo. Esta carta não pode atacar no turno em que você ativar este efeito.',
        price: 145.9,
        oldPrice: 180.0,
        image: '/images/cards/detail/blue-eyes-chaos-dragon.png',
        fullImage: '/images/cards/detail/blue-eyes-chaos-dragon.png',
        game: 'yugioh',
        cardType: 'MONSTER',
        rarity: 'Ultra Rare',
        stock: 8,
        badge: 'PROMO',
        cardSubtypes: 'DRAGON / RITUAL / EFFECT',
        edition: '1st Edition',
    },
];

export const MOCK_CART_ITEMS: CartItem[] = [
    {
        id: 1,
        name: 'Black Lotus (Proxy Art)',
        image: '/images/cards/black-lotus-proxy.png',
        price: 45.0,
        quantity: 1,
        game: 'mtg',
        category: 'Magic: The Gathering',
        details: 'Condição: NM (Near Mint) • Idioma: PT-BR',
    },
    {
        id: 2,
        name: 'Blue-Eyes White Dragon',
        image: '/images/cards/blue-eyes-white-dragon.png',
        price: 120.0,
        quantity: 1,
        game: 'yugioh',
        category: 'Yu-Gi-Oh!',
        details: 'Edição: LOB-001 • 1ª Edição',
        rarity: 'RARE',
    },
    {
        id: 3,
        name: 'Pro-Matte Sleeves (60un)',
        image: '/images/cards/sleeves-pro-matte.jpg',
        price: 25.0,
        quantity: 2,
        category: 'Acessórios',
        details: 'Cor: Preto Fosco',
    },
];

export function getProductById(id: number): Product | undefined {
    return MOCK_PRODUCTS.find((p) => p.id === id);
}

export const ORDER_STATUS_FILTERS: { label: string; value: OrderStatus | null }[] = [
    { label: 'TODOS', value: null },
    { label: 'PENDENTES', value: 'PENDING' },
    { label: 'PROCESSANDO', value: 'PROCESSING' },
    { label: 'ENVIADOS', value: 'SHIPPED' },
    { label: 'ENTREGUES', value: 'DELIVERED' },
    { label: 'CANCELADOS', value: 'CANCELLED' },
];

export const ORDER_STATUS_CONFIG: Record<
    OrderStatus,
    { label: string; color: string; bg: string; border: string; rotate: string }
> = {
    PENDING: { label: 'PENDENTE', color: '#A16207', bg: '#FEF9C3', border: '#EAB308', rotate: '-1deg' },
    PROCESSING: { label: 'PROCESSANDO', color: '#2563EB', bg: '#DBEAFE', border: '#2563EB', rotate: '-2deg' },
    SHIPPED: { label: 'ENVIADO', color: '#9333EA', bg: '#F3E8FF', border: '#9333EA', rotate: '2deg' },
    DELIVERED: { label: 'ENTREGUE', color: '#16A34A', bg: '#DCFCE7', border: '#16A34A', rotate: '1deg' },
    CANCELLED: { label: 'CANCELADO', color: '#DC2626', bg: '#FEE2E2', border: '#DC2626', rotate: '-3deg' },
};

export const ORDERS_PER_PAGE = 5;

export const MOCK_ORDERS: Order[] = [
    {
        id: 1,
        code: '#CS-9921',
        totalPrice: 450.0,
        status: 'PROCESSING',
        createdAt: '2023-10-24T10:30:00Z',
        items: [
            { id: 1, quantity: 1, unitPrice: 145.9, product: { name: 'Blue-Eyes White Dragon', image: '/images/orders/card-art-1.png', game: 'yugioh', cardType: 'MONSTER', rarity: 'Ultra Rare' } },
            { id: 2, quantity: 1, unitPrice: 120.0, product: { name: 'Dark Magician', image: '/images/orders/card-art-2.png', game: 'yugioh', cardType: 'MONSTER', rarity: 'Ultra Rare' } },
            { id: 3, quantity: 2, unitPrice: 45.0, product: { name: 'Pro-Matte Sleeves (60un)', image: '/images/orders/sleeves.png', game: 'yugioh', cardType: 'SPELL' } },
            { id: 4, quantity: 1, unitPrice: 89.1, product: { name: 'Stardust Dragon', image: '/images/orders/card.png', game: 'yugioh', cardType: 'MONSTER' } },
        ],
    },
    {
        id: 2,
        code: '#CS-8842',
        totalPrice: 1250.0,
        status: 'DELIVERED',
        createdAt: '2023-10-10T14:00:00Z',
        items: [
            { id: 5, quantity: 1, unitPrice: 1250.0, product: { name: 'MTG Commander Deck Box', image: '/images/orders/booster-box.png', game: 'mtg', cardType: 'CREATURE' } },
        ],
    },
    {
        id: 3,
        code: '#CS-9945',
        totalPrice: 89.9,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        isNew: true,
        items: [
            { id: 6, quantity: 1, unitPrice: 25.0, product: { name: 'Dragon Shield Sleeves', image: '/images/orders/sleeves.png', game: 'yugioh', cardType: 'SPELL' } },
            { id: 7, quantity: 1, unitPrice: 12.0, product: { name: 'Card Protector Set', image: '/images/orders/card-art-1.png', game: 'mtg', cardType: 'CREATURE' } },
            { id: 8, quantity: 1, unitPrice: 10.0, product: { name: 'Deck Box Premium', image: '/images/orders/card-art-2.png', game: 'mtg', cardType: 'SPELL' } },
            { id: 9, quantity: 1, unitPrice: 15.0, product: { name: 'Playmat Dragon', image: '/images/orders/card.png', game: 'yugioh', cardType: 'MONSTER' } },
            { id: 10, quantity: 1, unitPrice: 14.0, product: { name: 'Dice Set D20', image: '/images/orders/booster-box.png', game: 'mtg', cardType: 'CREATURE' } },
            { id: 11, quantity: 1, unitPrice: 13.9, product: { name: 'Card Binder 9-Pocket', image: '/images/orders/card-art-1.png', game: 'yugioh', cardType: 'TRAP' } },
        ],
    },
    {
        id: 4,
        code: '#CS-7721',
        totalPrice: 320.0,
        status: 'SHIPPED',
        createdAt: '2023-09-28T08:00:00Z',
        items: [
            { id: 12, quantity: 1, unitPrice: 320.0, product: { name: 'Dark Magician Girl (Alt Art)', image: '/images/orders/card.png', game: 'yugioh', cardType: 'MONSTER', rarity: 'Secret Rare' } },
        ],
    },
    {
        id: 5,
        code: '#CS-6602',
        totalPrice: 0,
        status: 'CANCELLED',
        createdAt: '2023-09-15T12:00:00Z',
        items: [
            { id: 13, quantity: 1, unitPrice: 199.9, product: { name: 'Pre-order: Ixalan Bundle', image: '/images/orders/booster-box.png', game: 'mtg', cardType: 'CREATURE' } },
        ],
    },
    {
        id: 6,
        code: '#CS-5510',
        totalPrice: 75.0,
        status: 'DELIVERED',
        createdAt: '2023-09-01T09:00:00Z',
        items: [
            { id: 14, quantity: 3, unitPrice: 25.0, product: { name: 'Booster Pack Phyrexia', image: '/images/orders/booster-box.png', game: 'mtg', cardType: 'CREATURE' } },
        ],
    },
    {
        id: 7,
        code: '#CS-5023',
        totalPrice: 210.0,
        status: 'DELIVERED',
        createdAt: '2023-08-20T16:00:00Z',
        items: [
            { id: 15, quantity: 1, unitPrice: 210.0, product: { name: 'Red-Eyes Black Dragon', image: '/images/orders/card-art-2.png', game: 'yugioh', cardType: 'MONSTER', rarity: 'Secret Rare' } },
        ],
    },
    {
        id: 8,
        code: '#CS-4891',
        totalPrice: 560.0,
        status: 'CANCELLED',
        createdAt: '2023-08-15T11:00:00Z',
        items: [
            { id: 16, quantity: 2, unitPrice: 280.0, product: { name: 'Collector Booster Box', image: '/images/orders/booster-box.png', game: 'mtg', cardType: 'CREATURE' } },
        ],
    },
    {
        id: 9,
        code: '#CS-4455',
        totalPrice: 180.0,
        status: 'PROCESSING',
        createdAt: '2023-08-10T14:30:00Z',
        items: [
            { id: 17, quantity: 1, unitPrice: 90.0, product: { name: 'Jace, the Mind Sculptor', image: '/images/orders/card-art-1.png', game: 'mtg', cardType: 'CREATURE', rarity: 'Mythic Rare' } },
            { id: 18, quantity: 1, unitPrice: 90.0, product: { name: 'Liliana of the Veil', image: '/images/orders/card-art-2.png', game: 'mtg', cardType: 'CREATURE', rarity: 'Mythic Rare' } },
        ],
    },
    {
        id: 10,
        code: '#CS-4102',
        totalPrice: 35.0,
        status: 'SHIPPED',
        createdAt: '2023-07-25T10:00:00Z',
        items: [
            { id: 19, quantity: 1, unitPrice: 35.0, product: { name: 'Ultra Pro Playmat', image: '/images/orders/sleeves.png', game: 'mtg', cardType: 'SPELL' } },
        ],
    },
    {
        id: 11,
        code: '#CS-3980',
        totalPrice: 420.0,
        status: 'PENDING',
        createdAt: '2023-07-20T08:00:00Z',
        items: [
            { id: 20, quantity: 1, unitPrice: 420.0, product: { name: 'Pot of Greed (Prismatic)', image: '/images/orders/card.png', game: 'yugioh', cardType: 'SPELL', rarity: 'Prismatic Secret' } },
        ],
    },
    {
        id: 12,
        code: '#CS-3501',
        totalPrice: 95.0,
        status: 'DELIVERED',
        createdAt: '2023-07-10T13:00:00Z',
        items: [
            { id: 21, quantity: 1, unitPrice: 45.0, product: { name: 'Mirror Force', image: '/images/orders/card-art-1.png', game: 'yugioh', cardType: 'TRAP', rarity: 'Ultra Rare' } },
            { id: 22, quantity: 1, unitPrice: 50.0, product: { name: 'Torrential Tribute', image: '/images/orders/card-art-2.png', game: 'yugioh', cardType: 'TRAP', rarity: 'Super Rare' } },
        ],
    },
];

export const MOCK_RELATED_PRODUCTS: Product[] = [
    {
        id: 101,
        name: 'Dark Magician',
        description: 'O mago supremo em termos de ataque e defesa.',
        price: 89.9,
        image: '/images/cards/detail/related-1.png',
        game: 'yugioh',
        cardType: 'MONSTER',
        rarity: 'Ultra Rare',
        cardSubtypes: 'Spellcaster',
        stock: 12,
        badge: 'NOVO',
    },
    {
        id: 102,
        name: 'Red-Eyes Black Dragon',
        description: 'Um dragão feroz com um ataque mortal.',
        price: 210.0,
        oldPrice: 250.0,
        image: '/images/cards/detail/related-2.png',
        game: 'yugioh',
        cardType: 'MONSTER',
        rarity: 'Secret Rare',
        cardSubtypes: 'Dragon',
        stock: 5,
        badge: 'PROMO',
    },
    {
        id: 103,
        name: 'Stardust Dragon',
        description: 'Dragão synchro que protege suas cartas da destruição.',
        price: 450.0,
        image: '/images/cards/detail/related-3.png',
        game: 'yugioh',
        cardType: 'MONSTER',
        rarity: 'Ghost Rare',
        cardSubtypes: 'Synchro',
        stock: 2,
    },
    {
        id: 104,
        name: 'Exodia the Forbidden',
        description: 'Uma das cinco peças que garantem a vitória automática.',
        price: 120.0,
        image: '/images/cards/detail/related-4.png',
        game: 'yugioh',
        cardType: 'MONSTER',
        rarity: 'Ultra Rare',
        cardSubtypes: 'Spellcaster',
        stock: 3,
    },
];
