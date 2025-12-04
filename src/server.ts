import 'dotenv/config';
import app from './app';
import prisma from './database/prisma';

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await prisma.$connect();
        console.log('Conectado ao banco de dados PostgreSQL via Prisma');

        app.listen(PORT, () => {
            console.log(`Servidor CardShop rodando em http://localhost:${PORT}`);
            console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        process.exit(1);
    }
}

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    console.log('Conexão com o banco de dados encerrada');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    console.log('Conexão com o banco de dados encerrada');
    process.exit(0);
});

startServer();
