import fs from 'fs';
import path from 'path';
import app from './app';
import config from './config/server';
import pool from './database/connection';

const PORT = config.port || 3000;

async function initDatabase() {
    try {
        const initSql = fs.readFileSync(
            path.join(__dirname, 'database', 'init.sql'),
            'utf-8'
        );
        await pool.query(initSql);
        console.log('Banco de dados inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar banco de dados:', error);
        process.exit(1);
    }
}

async function startServer() {
    await initDatabase();

    app.listen(PORT, () => {
        console.log(`Servidor CardShop rodando em http://localhost:${PORT}`);
        console.log(`Ambiente: ${config.environment}`);
    });
}

startServer();
