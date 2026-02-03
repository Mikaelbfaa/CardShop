import { expect } from 'chai';
import express from 'express';
import rateLimit from 'express-rate-limit';
import supertest from 'supertest';

describe('RateLimitMiddleware', () => {
    describe('strict limiter (autenticação)', () => {
        const strictMax = 3;
        let testApp: express.Express;

        beforeEach(() => {
            testApp = express();
            testApp.use(express.json());

            const strictLimiter = rateLimit({
                windowMs: 900000,
                max: strictMax,
                standardHeaders: 'draft-7',
                legacyHeaders: false,

                handler: (_req, res) => {
                    res.status(429).json({
                        error: {
                            message:
                                'Muitas tentativas de autenticação. Por favor, tente novamente mais tarde.',
                            status: 429,
                        },
                    });
                },
            });

            testApp.post('/api/users/login', strictLimiter, (_req, res) => {
                res.status(200).json({ success: true });
            });
        });

        it('deve permitir requisições abaixo do limite', async () => {
            const res = await supertest(testApp)
                .post('/api/users/login')
                .send({ email: 'test@test.com', password: '123' });

            expect(res.status).to.equal(200);
        });

        it('deve retornar 429 ao exceder o limite de requisições', async () => {
            for (let i = 0; i < strictMax; i++) {
                await supertest(testApp)
                    .post('/api/users/login')
                    .send({ email: 'test@test.com', password: '123' });
            }

            const res = await supertest(testApp)
                .post('/api/users/login')
                .send({ email: 'test@test.com', password: '123' });

            expect(res.status).to.equal(429);
        });

        it('deve retornar corpo de erro no formato correto ao exceder o limite', async () => {
            for (let i = 0; i < strictMax; i++) {
                await supertest(testApp)
                    .post('/api/users/login')
                    .send({ email: 'test@test.com', password: '123' });
            }

            const res = await supertest(testApp)
                .post('/api/users/login')
                .send({ email: 'test@test.com', password: '123' });

            expect(res.body).to.deep.equal({
                error: {
                    message:
                        'Muitas tentativas de autenticação. Por favor, tente novamente mais tarde.',
                    status: 429,
                },
            });
        });

        it('deve incluir header retry-after na resposta 429', async () => {
            for (let i = 0; i < strictMax; i++) {
                await supertest(testApp)
                    .post('/api/users/login')
                    .send({ email: 'test@test.com', password: '123' });
            }

            const res = await supertest(testApp)
                .post('/api/users/login')
                .send({ email: 'test@test.com', password: '123' });

            expect(res.status).to.equal(429);
            expect(res.headers['retry-after']).to.exist;
        });
    });

    describe('global limiter', () => {
        const globalMax = 3;
        let testApp: express.Express;

        beforeEach(() => {
            testApp = express();
            testApp.use(express.json());

            const globalLimiter = rateLimit({
                windowMs: 900000,
                max: globalMax,
                standardHeaders: 'draft-7',
                legacyHeaders: false,

                handler: (_req, res) => {
                    res.status(429).json({
                        error: {
                            message:
                                'Muitas requisições. Por favor, tente novamente mais tarde.',
                            status: 429,
                        },
                    });
                },
            });

            testApp.use('/api/', globalLimiter);
            testApp.get('/api/products', (_req, res) => {
                res.status(200).json({ success: true });
            });
        });

        it('deve permitir requisições abaixo do limite global', async () => {
            const res = await supertest(testApp).get('/api/products');

            expect(res.status).to.equal(200);
        });

        it('deve retornar 429 ao exceder o limite global', async () => {
            for (let i = 0; i < globalMax; i++) {
                await supertest(testApp).get('/api/products');
            }

            const res = await supertest(testApp).get('/api/products');

            expect(res.status).to.equal(429);
            expect(res.body).to.deep.equal({
                error: {
                    message:
                        'Muitas requisições. Por favor, tente novamente mais tarde.',
                    status: 429,
                },
            });
        });
    });
});
