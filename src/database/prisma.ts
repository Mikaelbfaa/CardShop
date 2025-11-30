import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// Pool de conexões do PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Adapter do Prisma para PostgreSQL
const adapter = new PrismaPg(pool);

// Instância global do PrismaClient para evitar múltiplas conexões em desenvolvimento
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;
