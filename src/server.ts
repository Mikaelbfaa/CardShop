import 'dotenv/config';
import app from './app';
import prisma from './database/prisma';

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Garante conexão ao banco antes de aceitar requisições HTTP
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

// Graceful shutdown: encerra conexão ao banco antes de sair
// SIGINT = Ctrl+C (desenvolvimento), SIGTERM = sinal de encerramento (container/systemd)
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
