const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

const productRoutes = require('./controllers/product_routes');

app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Erro interno do servidor',
            status: err.status || 500
        }
    });
});

app.use((req, res) => {
    res.status(404).json({
        error: {
            message: 'Rota não encontrada',
            status: 404
        }
    });
});

module.exports = app;
