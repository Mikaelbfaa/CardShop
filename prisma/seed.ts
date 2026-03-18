import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
});

// --- Helpers para buscar dados das APIs de cartas ---

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface CardApiData {
    image: string;
    fullImage: string;
    description: string;
    cardSubtypes?: string;
    rarity?: string;
}

async function fetchMtgCard(name: string): Promise<CardApiData | null> {
    try {
        const url = `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}`;
        const res = await fetch(url);
        if (!res.ok) {
            console.warn(`  ⚠ Scryfall: ${name} não encontrado (${res.status})`);
            return null;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await res.json();
        // Scryfall pede 50-100ms entre requisições
        await delay(100);
        return {
            image: data.image_uris?.art_crop ?? null,
            fullImage: data.image_uris?.png ?? null,
            description: data.oracle_text ?? '',
            cardSubtypes: data.type_line ?? undefined,
            rarity: data.rarity
                ? data.rarity.charAt(0).toUpperCase() + data.rarity.slice(1)
                : undefined,
        };
    } catch (err) {
        console.warn(`  ⚠ Erro ao buscar ${name} no Scryfall:`, err);
        return null;
    }
}

async function fetchYugiohCard(name: string): Promise<CardApiData | null> {
    try {
        const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encodeURIComponent(name)}`;
        const res = await fetch(url);
        if (!res.ok) {
            console.warn(`  ⚠ YGOPRODeck: ${name} não encontrado (${res.status})`);
            return null;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const json: any = await res.json();
        const card = json.data?.[0];
        if (!card) return null;
        return {
            image: card.card_images?.[0]?.image_url_cropped ?? null,
            fullImage: card.card_images?.[0]?.image_url ?? null,
            description: card.desc ?? '',
            cardSubtypes: [card.race, card.type].filter(Boolean).join(' / '),
            rarity: card.card_sets?.[0]?.set_rarity ?? undefined,
        };
    } catch (err) {
        console.warn(`  ⚠ Erro ao buscar ${name} no YGOPRODeck:`, err);
        return null;
    }
}

// --- Seed principal ---

async function main() {
    console.log('Iniciando seed do banco de dados...');

    const SALT_ROUNDS = 10;

    // Criar usuários
    const adminPassword = await bcrypt.hash('admin123', SALT_ROUNDS);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@cardshop.com' },
        update: { password: adminPassword },
        create: {
            name: 'Administrador',
            email: 'admin@cardshop.com',
            password: adminPassword,
            cpf: '00000000000',
            phone: '11999999999',
            address: 'Rua Admin, 1 - São Paulo, SP',
            role: 'ADMIN',
        },
    });
    console.log(`Usuário admin criado: ${admin.email} (ID: ${admin.id})`);

    const customerPassword = await bcrypt.hash('cliente123', SALT_ROUNDS);
    const customer = await prisma.user.upsert({
        where: { email: 'cliente@cardshop.com' },
        update: { password: customerPassword },
        create: {
            name: 'Cliente Teste',
            email: 'cliente@cardshop.com',
            password: customerPassword,
            cpf: '11111111111',
            phone: '11988888888',
            address: 'Rua Cliente, 100 - São Paulo, SP',
            role: 'CUSTOMER',
        },
    });
    console.log(`Usuário cliente criado: ${customer.email} (ID: ${customer.id})`);

    // Produtos da homepage (MOCK_PRODUCTS — devem vir primeiro para manter a ordem)
    const homepageProducts = [
        {
            name: 'The Wandering Emperor',
            description: 'Planeswalker lendária de Magic: The Gathering.',
            price: 89.9,
            stock: 4,
            game: 'mtg' as const,
            cardType: 'PLANESWALKER' as const,
            rarity: 'Mythic Rare',
            badge: 'NOVO',
        },
        {
            name: 'Gift of Orzhova',
            description: 'Encantamento clássico do clã Orzhov.',
            price: 12.5,
            oldPrice: 25.0,
            stock: 15,
            game: 'mtg' as const,
            cardType: 'ENCHANTMENT' as const,
            rarity: 'Uncommon',
            badge: 'PROMO',
        },
        {
            name: 'Path to Exile',
            description: 'Carta ilustrada com arte exclusiva.',
            price: 45.0,
            stock: 7,
            game: 'mtg' as const,
            cardType: 'INSTANT' as const,
            rarity: 'Rare',
        },
        {
            name: 'Sword of Feast and Famine',
            description: 'Artefato poderoso de equipamento.',
            price: 120.0,
            stock: 3,
            game: 'mtg' as const,
            cardType: 'ARTIFACT' as const,
            rarity: 'Mythic Rare',
        },
        {
            name: 'Blue-Eyes Chaos MAX Dragon',
            description: 'Esta carta não pode ser invocada por invocação normal ou setada.',
            price: 145.9,
            oldPrice: 180.0,
            stock: 8,
            game: 'yugioh' as const,
            cardType: 'MONSTER' as const,
            rarity: 'Ultra Rare',
            badge: 'PROMO',
            cardSubtypes: 'DRAGON / RITUAL / EFFECT',
            edition: '1st Edition',
        },
    ];

    // Produtos Yugioh adicionais
    const yugiohProducts = [
        {
            name: 'Dark Magician',
            description: 'O mago definitivo em termos de ataque e defesa',
            price: 45.9,
            stock: 10,
            game: 'yugioh' as const,
            cardType: 'MONSTER' as const,
            rarity: 'Ultra Rare',
            cardSubtypes: 'SPELLCASTER',
            edition: '1st Edition',
        },
        {
            name: 'Blue-Eyes White Dragon',
            description: 'Este lendário dragão é uma poderosa máquina de destruição',
            price: 89.9,
            stock: 5,
            game: 'yugioh' as const,
            cardType: 'MONSTER' as const,
            rarity: 'Secret Rare',
            cardSubtypes: 'DRAGON',
            edition: '1st Edition',
        },
        {
            name: 'Pot of Greed',
            description: 'Compre 2 cartas do seu deck',
            price: 120.0,
            oldPrice: 150.0,
            stock: 3,
            game: 'yugioh' as const,
            cardType: 'SPELL' as const,
            rarity: 'Rare',
            badge: 'PROMO',
        },
        {
            name: 'Mirror Force',
            description:
                'Quando um monstro adversário declarar um ataque: destrua todos os monstros de ataque do oponente',
            price: 35.0,
            stock: 8,
            game: 'yugioh' as const,
            cardType: 'TRAP' as const,
            rarity: 'Rare',
        },
    ];

    // Produtos Magic the Gathering adicionais
    const mtgProducts = [
        {
            name: 'Lightning Bolt',
            description: 'Lightning Bolt causa 3 pontos de dano a qualquer alvo',
            price: 25.0,
            stock: 20,
            game: 'mtg' as const,
            cardType: 'INSTANT' as const,
            rarity: 'Common',
        },
        {
            name: 'Llanowar Elves',
            description: 'Criatura elfo que gera mana verde',
            price: 5.0,
            stock: 50,
            game: 'mtg' as const,
            cardType: 'CREATURE' as const,
            rarity: 'Common',
            badge: 'NOVO',
        },
        {
            name: 'Sol Ring',
            description: 'Artefato essencial para Commander - adiciona 2 manas incolores',
            price: 89.9,
            oldPrice: 120.0,
            stock: 15,
            game: 'mtg' as const,
            cardType: 'ARTIFACT' as const,
            rarity: 'Uncommon',
            badge: 'PROMO',
        },
        {
            name: 'Wrath of God',
            description: 'Destrói todas as criaturas. Elas não podem ser regeneradas',
            price: 45.0,
            stock: 10,
            game: 'mtg' as const,
            cardType: 'SORCERY' as const,
            rarity: 'Rare',
        },
        {
            name: 'Rhystic Study',
            description:
                'Sempre que um oponente conjura uma magia, você pode comprar uma carta a menos que ele pague 1',
            price: 150.0,
            stock: 3,
            game: 'mtg' as const,
            cardType: 'ENCHANTMENT' as const,
            rarity: 'Rare',
        },
        {
            name: 'Command Tower',
            description: 'Terreno que gera mana de qualquer cor da identidade do seu comandante',
            price: 2.5,
            stock: 100,
            game: 'mtg' as const,
            cardType: 'LAND' as const,
            rarity: 'Common',
        },
        {
            name: 'Jace, the Mind Sculptor',
            description: 'Planeswalker lendário com 4 habilidades poderosas',
            price: 280.0,
            stock: 2,
            game: 'mtg' as const,
            cardType: 'PLANESWALKER' as const,
            rarity: 'Mythic Rare',
            badge: 'NOVO',
        },
    ];

    // Inserir produtos buscando imagens e descrições das APIs
    console.log('\nBuscando dados das APIs de cartas...');
    const allProducts = [...homepageProducts, ...yugiohProducts, ...mtgProducts];

    for (const product of allProducts) {
        const apiData =
            product.game === 'mtg'
                ? await fetchMtgCard(product.name)
                : await fetchYugiohCard(product.name);

        const finalProduct = apiData ? { ...product, ...apiData } : product;

        if (apiData) {
            console.log(`  ✓ ${product.name}: imagens da API`);
        } else {
            console.log(`  ✗ ${product.name}: usando dados locais (fallback)`);
        }

        await prisma.product.upsert({
            where: { name: product.name },
            update: finalProduct,
            create: finalProduct,
        });
    }

    // Criar carrinho para o cliente
    const cart = await prisma.cart.upsert({
        where: { userId: customer.id },
        update: {},
        create: {
            userId: customer.id,
        },
    });
    console.log(`\nCarrinho criado para usuário ${customer.id} (Cart ID: ${cart.id})`);

    console.log('\nSeed concluído com sucesso!');
    console.log('\nDados criados:');
    console.log(`- 2 usuários (admin ID: ${admin.id}, cliente ID: ${customer.id})`);
    console.log(`- ${allProducts.length} produtos`);
    console.log(`- 1 carrinho para o cliente`);
}

main()
    .catch((e) => {
        console.error('Erro ao executar seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
