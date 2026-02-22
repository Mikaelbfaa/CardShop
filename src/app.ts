import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import rateLimitMiddleware from './middleware/rateLimit';
import productRoutes from './routes/product';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/order';
import userRoutes from './routes/user';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/', rateLimitMiddleware.global);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (_req: Request, res: Response) => {
    res.json(swaggerSpec);
});

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

app.get('/', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handler global — Express identifica como middleware de erro pela assinatura de 4 parâmetros
app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    const status = err.status || 500;
    res.status(status).json({
        error: {
            message: err.message || 'Erro interno do servidor',
            status,
        },
    });
});

// Handler 404 catch-all — deve ficar após todas as rotas registradas
app.use((_req: Request, res: Response) => {
    res.status(404).json({
        error: {
            message: 'Rota não encontrada',
            status: 404,
        },
    });
});

export default app;
