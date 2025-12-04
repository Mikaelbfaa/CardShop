import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    console.log('Iniciando seed do banco de dados...');

    // Criar usuários
    const admin = await prisma.user.upsert({
        where: { email: 'admin@cardshop.com' },
        update: {},
        create: {
            name: 'Administrador',
            email: 'admin@cardshop.com',
            password: 'admin123', // Em produção, usar hash
            cpf: '00000000000',
            phone: '11999999999',
            address: 'Rua Admin, 1 - São Paulo, SP',
            role: 'ADMIN',
        },
    });
    console.log(`Usuário admin criado: ${admin.email} (ID: ${admin.id})`);

    const customer = await prisma.user.upsert({
        where: { email: 'cliente@cardshop.com' },
        update: {},
        create: {
            name: 'Cliente Teste',
            email: 'cliente@cardshop.com',
            password: 'cliente123', // Em produção, usar hash
            cpf: '11111111111',
            phone: '11988888888',
            address: 'Rua Cliente, 100 - São Paulo, SP',
            role: 'CUSTOMER',
        },
    });
    console.log(`Usuário cliente criado: ${customer.email} (ID: ${customer.id})`);

    // Criar produtos Yugioh
    const yugiohProducts = [
        {
            name: 'Dark Magician',
            description: 'O mago definitivo em termos de ataque e defesa',
            price: 45.9,
            stock: 10,
            game: 'yugioh' as const,
            cardType: 'MONSTER' as const,
            rarity: 'Ultra Rare',
        },
        {
            name: 'Blue-Eyes White Dragon',
            description: 'Este lendário dragão é uma poderosa máquina de destruição',
            price: 89.9,
            stock: 5,
            game: 'yugioh' as const,
            cardType: 'MONSTER' as const,
            rarity: 'Secret Rare',
        },
        {
            name: 'Pot of Greed',
            description: 'Compre 2 cartas do seu deck',
            price: 120.0,
            stock: 3,
            game: 'yugioh' as const,
            cardType: 'SPELL' as const,
            rarity: 'Rare',
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

    // Criar produtos Magic the Gathering
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
        },
        {
            name: 'Sol Ring',
            description: 'Artefato essencial para Commander - adiciona 2 manas incolores',
            price: 89.9,
            stock: 15,
            game: 'mtg' as const,
            cardType: 'ARTIFACT' as const,
            rarity: 'Uncommon',
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
        },
    ];

    // Inserir produtos
    for (const product of [...yugiohProducts, ...mtgProducts]) {
        const created = await prisma.product.upsert({
            where: { name: product.name },
            update: {},
            create: product,
        });
        console.log(`Produto criado: ${created.name} (ID: ${created.id})`);
    }

    // Criar carrinho para o cliente
    const cart = await prisma.cart.upsert({
        where: { userId: customer.id },
        update: {},
        create: {
            userId: customer.id,
        },
    });
    console.log(`Carrinho criado para usuário ${customer.id} (Cart ID: ${cart.id})`);

    console.log('\nSeed concluído com sucesso!');
    console.log('\nDados criados:');
    console.log(`- 2 usuários (admin ID: ${admin.id}, cliente ID: ${customer.id})`);
    console.log(`- ${yugiohProducts.length + mtgProducts.length} produtos`);
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
