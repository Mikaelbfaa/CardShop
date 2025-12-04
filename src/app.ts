import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import productRoutes from './controllers/product_routes';
import cartRoutes from './controllers/cart_routes';
import orderRoutes from './controllers/order_routes';
import adminOrderRoutes from './controllers/admin_order_routes';
import userRoutes from './controllers/user.routes'; 


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api/v1/users', userRoutes); 

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (_req: Request, res: Response) => {
    res.json(swaggerSpec);
});

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin/orders', adminOrderRoutes);

app.get('/', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

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

app.use((_req: Request, res: Response) => {
    res.status(404).json({
        error: {
            message: 'Rota não encontrada',
            status: 404,
        },
    });
});

export default app;
