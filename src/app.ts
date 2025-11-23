import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import productRoutes from './controllers/product_routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/products', productRoutes);

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Erro interno do servidor',
            status: err.status || 500
        }
    });
});

app.use((req: Request, res: Response) => {
    res.status(404).json({
        error: {
            message: 'Rota não encontrada',
            status: 404
        }
    });
});

export default app;
