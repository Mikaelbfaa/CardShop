import app from './app';
import config from './config/server';

const PORT = config.port || 3000;

app.listen(PORT, () => {
    console.log(`Servidor CardShop rodando em http://localhost:${PORT}`);
    console.log(`Ambiente: ${config.environment}`);
});
