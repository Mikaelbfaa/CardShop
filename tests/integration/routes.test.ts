import { expect } from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';
import crypto from 'crypto';
import app from '../../src/app';

import productRepository from '../../src/repository/product';
import UserService from '../../src/services/user';

const JWT_SECRET = process.env.JWT_SECRET as string;

// Precisei adicionar esses métodos pois o jsonwebtoken estava causando um problema 

function base64url(buf: Buffer): string {
    return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function signToken(payload: Record<string, unknown>): string {
    const now = Math.floor(Date.now() / 1000);
    const full = { ...payload, iat: now, exp: now + 3600 };
    const header = base64url(Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
    const body = base64url(Buffer.from(JSON.stringify(full)));
    const sig = base64url(crypto.createHmac('sha256', JWT_SECRET).update(header + '.' + body).digest());
    return header + '.' + body + '.' + sig;
}

function makeCustomerToken(userId = 1) {
    return signToken({ userId, role: 'CUSTOMER' });
}

function makeAdminToken(userId = 99) {
    return signToken({ userId, role: 'ADMIN' });
}

describe('Rotas da API (integração)', () => {
    let cartService: any;
    let orderService: any;
    let productService: any;

    before(() => {
        cartService = require('../../src/services/cart').default;
        orderService = require('../../src/services/order').default;
        productService = require('../../src/services/product').default;
    });

    afterEach(() => {
        sinon.restore();
    });

    // Testes das rotas /products

    describe('GET /api/products', () => {
        it('deve retornar 200 com array de produtos', async () => {
            sinon.stub(productRepository, 'findAll').resolves([
                {
                    id: 1,
                    name: 'Dark Magician',
                    description: 'Mago Negro',
                    price: 29.99 as any,
                    stock: 10,
                    game: 'yugioh' as any,
                    cardType: 'MONSTER' as any,
                    rarity: 'Ultra Rare',
                    image: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ]);

            const res = await supertest(app).get('/api/products');

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body.data).to.be.an('array');
            expect(res.body.data).to.have.lengthOf(1);
        });
    });

    describe('GET /api/products/:id', () => {
        it('deve retornar 200 ao buscar produto existente', async () => {
            const mockProduct = {
                id: 1,
                name: 'Dark Magician',
                description: 'Mago Negro',
                price: 29.99 as any,
                stock: 10,
                game: 'yugioh' as any,
                cardType: 'MONSTER' as any,
                rarity: 'Ultra Rare',
                image: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            sinon.stub(productRepository, 'findById').resolves(mockProduct);

            const res = await supertest(app).get('/api/products/1');

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body.data).to.be.an('object');
            expect(res.body.data.id).to.equal(1);
            expect(res.body.data.name).to.equal('Dark Magician');
            expect(res.body.data.game).to.equal('yugioh');
        });

        it('deve retornar 404 quando produto não existe', async () => {
            sinon.stub(productRepository, 'findById').resolves(null);

            const res = await supertest(app).get('/api/products/999');

            expect(res.status).to.equal(404);
            expect(res.body.success).to.be.false;
            expect(res.body.message).to.equal('Produto não encontrado');
        });
    });

    describe('POST /api/products', () => {
        it('deve retornar 201 ao criar produto como admin', async () => {
            sinon.stub(productService, 'createProduct').resolves({
                id: 1,
                name: 'Dark Magician',
                price: 29.99,
                stock: 10,
                game: 'yugioh',
                cardType: 'MONSTER',
                description: null,
                rarity: null,
                image: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const res = await supertest(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${makeAdminToken()}`)
                .send({ name: 'Dark Magician', price: 29.99, stock: 10, game: 'yugioh' });

            expect(res.status).to.equal(201);
            expect(res.body.success).to.be.true;
            expect(res.body.data.name).to.equal('Dark Magician');
        });

        it('deve retornar 403 quando CUSTOMER tenta criar produto', async () => {
            const res = await supertest(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${makeCustomerToken()}`)
                .send({ name: 'Test', price: 10, stock: 5, game: 'yugioh' });

            expect(res.status).to.equal(403);
        });

        it('deve retornar 401 sem token', async () => {
            const res = await supertest(app)
                .post('/api/products')
                .send({ name: 'Test', price: 10, stock: 5, game: 'yugioh' });

            expect(res.status).to.equal(401);
        });
    });

    describe('PUT /api/products/:id', () => {
        it('deve retornar 200 ao atualizar produto como admin', async () => {
            sinon.stub(productService, 'updateProduct').resolves({
                id: 1,
                name: 'Dark Magician',
                price: 39.99,
                stock: 10,
                game: 'yugioh',
                cardType: 'MONSTER',
                description: null,
                rarity: null,
                image: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const res = await supertest(app)
                .put('/api/products/1')
                .set('Authorization', `Bearer ${makeAdminToken()}`)
                .send({ price: 39.99 });

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
        });

        it('deve retornar 404 quando produto não existe', async () => {
            sinon.stub(productService, 'updateProduct').resolves(null);

            const res = await supertest(app)
                .put('/api/products/999')
                .set('Authorization', `Bearer ${makeAdminToken()}`)
                .send({ price: 39.99 });

            expect(res.status).to.equal(404);
        });

        it('deve retornar 403 quando CUSTOMER tenta atualizar', async () => {
            const res = await supertest(app)
                .put('/api/products/1')
                .set('Authorization', `Bearer ${makeCustomerToken()}`)
                .send({ price: 39.99 });

            expect(res.status).to.equal(403);
        });
    });

    describe('DELETE /api/products/:id', () => {
        it('deve retornar 200 ao deletar produto como admin', async () => {
            sinon.stub(productService, 'deleteProduct').resolves(true);

            const res = await supertest(app)
                .delete('/api/products/1')
                .set('Authorization', `Bearer ${makeAdminToken()}`);

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
        });

        it('deve retornar 404 quando produto não existe', async () => {
            sinon.stub(productService, 'deleteProduct').resolves(null);

            const res = await supertest(app)
                .delete('/api/products/999')
                .set('Authorization', `Bearer ${makeAdminToken()}`);

            expect(res.status).to.equal(404);
        });

        it('deve retornar 409 quando produto está em uso', async () => {
            sinon.stub(productService, 'deleteProduct').rejects(
                new Error('Produto está em uso e não pode ser deletado')
            );

            const res = await supertest(app)
                .delete('/api/products/1')
                .set('Authorization', `Bearer ${makeAdminToken()}`);

            expect(res.status).to.equal(409);
        });

        it('deve retornar 403 quando CUSTOMER tenta deletar', async () => {
            const res = await supertest(app)
                .delete('/api/products/1')
                .set('Authorization', `Bearer ${makeCustomerToken()}`);

            expect(res.status).to.equal(403);
        });
    });

    // Teste das rotas /users

    describe('POST /api/users/register', () => {
        it('deve retornar 201 ao cadastrar usuário com sucesso', async () => {
            sinon.stub(UserService, 'registerNewUser').resolves({
                id: 1,
                name: 'Teste User',
                email: 'teste@email.com',
                cpf: '12345678900',
                phone: null,
                address: null,
                role: 'CUSTOMER' as any,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const res = await supertest(app).post('/api/users/register').send({
                name: 'Teste User',
                email: 'teste@email.com',
                password: 'senha123',
                cpf: '12345678900',
            });

            expect(res.status).to.equal(201);
            expect(res.body.success).to.be.true;
            expect(res.body.data.email).to.equal('teste@email.com');
        });

        it('deve retornar 400 quando campos obrigatórios estão faltando', async () => {
            const res = await supertest(app).post('/api/users/register').send({
                name: 'Teste User',
            });

            expect(res.status).to.equal(400);
            expect(res.body.success).to.be.false;
            expect(res.body.missingFields).to.be.an('array');
            expect(res.body.missingFields).to.include.members(['email', 'password', 'cpf']);
        });

        it('deve retornar 409 quando email já registrado', async () => {
            sinon.stub(UserService, 'registerNewUser').rejects(
                new Error('Erro ao cadastrar usuário: E-mail já registrado.')
            );

            const res = await supertest(app).post('/api/users/register').send({
                name: 'Teste',
                email: 'existente@email.com',
                password: 'senha123',
                cpf: '12345678900',
            });

            expect(res.status).to.equal(409);
            expect(res.body.success).to.be.false;
        });
    });

    describe('POST /api/users/login', () => {
        it('deve retornar 200 com token ao autenticar com sucesso', async () => {
            sinon.stub(UserService, 'authenticateUser').resolves({
                token: 'fake-jwt-token',
                user: {
                    id: 1,
                    name: 'Teste',
                    email: 'teste@email.com',
                    cpf: '12345678900',
                    phone: null,
                    address: null,
                    role: 'CUSTOMER' as any,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });

            const res = await supertest(app).post('/api/users/login').send({
                email: 'teste@email.com',
                password: 'senha123',
            });

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body.data.token).to.equal('fake-jwt-token');
        });

        it('deve retornar 401 com credenciais inválidas', async () => {
            sinon.stub(UserService, 'authenticateUser').rejects(
                new Error('Erro ao autenticar usuário: Credenciais inválidas.')
            );

            const res = await supertest(app).post('/api/users/login').send({
                email: 'naoexiste@email.com',
                password: 'senhaerrada',
            });

            expect(res.status).to.equal(401);
            expect(res.body.success).to.be.false;
        });

        it('deve retornar 400 quando campos obrigatórios faltam', async () => {
            const res = await supertest(app).post('/api/users/login').send({
                email: 'teste@email.com',
            });

            expect(res.status).to.equal(400);
            expect(res.body.success).to.be.false;
            expect(res.body.missingFields).to.include('password');
        });
    });

    describe('GET /api/users/profile', () => {
        it('deve retornar 200 com perfil do usuário autenticado', async () => {
            sinon.stub(UserService, 'findUserById').resolves({
                id: 1,
                name: 'Teste',
                email: 'teste@email.com',
                cpf: '12345678900',
                phone: null,
                address: null,
                role: 'CUSTOMER' as any,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const res = await supertest(app)
                .get('/api/users/profile')
                .set('Authorization', `Bearer ${makeCustomerToken()}`);

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body.data.email).to.equal('teste@email.com');
        });

        it('deve retornar 401 sem token', async () => {
            const res = await supertest(app).get('/api/users/profile');

            expect(res.status).to.equal(401);
        });

        it('deve retornar 404 quando usuário não encontrado', async () => {
            sinon.stub(UserService, 'findUserById').resolves(null);

            const res = await supertest(app)
                .get('/api/users/profile')
                .set('Authorization', `Bearer ${makeCustomerToken()}`);

            expect(res.status).to.equal(404);
            expect(res.body.success).to.be.false;
        });

        it('deve retornar 500 quando service lança erro', async () => {
            sinon.stub(UserService, 'findUserById').rejects(new Error('DB error'));

            const res = await supertest(app)
                .get('/api/users/profile')
                .set('Authorization', `Bearer ${makeCustomerToken()}`);

            expect(res.status).to.equal(500);
            expect(res.body.success).to.be.false;
        });
    });

    describe('PATCH /api/users/profile', () => {
        it('deve retornar 200 ao atualizar perfil', async () => {
            sinon.stub(UserService, 'updateUserProfile').resolves({
                id: 1,
                name: 'Novo Nome',
                email: 'teste@email.com',
                cpf: '12345678900',
                phone: null,
                address: null,
                role: 'CUSTOMER' as any,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const res = await supertest(app)
                .patch('/api/users/profile')
                .set('Authorization', `Bearer ${makeCustomerToken()}`)
                .send({ name: 'Novo Nome' });

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body.data.name).to.equal('Novo Nome');
        });

        it('deve retornar 401 sem token', async () => {
            const res = await supertest(app)
                .patch('/api/users/profile')
                .send({ name: 'Novo' });

            expect(res.status).to.equal(401);
        });

        it('deve retornar 400 quando body está vazio', async () => {
            const res = await supertest(app)
                .patch('/api/users/profile')
                .set('Authorization', `Bearer ${makeCustomerToken()}`)
                .send({});

            expect(res.status).to.equal(400);
            expect(res.body.success).to.be.false;
        });

        it('deve retornar 409 quando email duplicado', async () => {
            sinon.stub(UserService, 'updateUserProfile').rejects(
                new Error('Erro ao atualizar perfil: E-mail já registrado.')
            );

            const res = await supertest(app)
                .patch('/api/users/profile')
                .set('Authorization', `Bearer ${makeCustomerToken()}`)
                .send({ email: 'duplicado@email.com' });

            expect(res.status).to.equal(409);
            expect(res.body.success).to.be.false;
        });
    });

    describe('POST /api/users/logout', () => {
        it('deve retornar 200 ao fazer logout', async () => {
            const res = await supertest(app)
                .post('/api/users/logout')
                .set('Authorization', `Bearer ${makeCustomerToken()}`);

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body.message).to.equal('Logout realizado com sucesso');
        });

        it('deve retornar 401 sem token', async () => {
            const res = await supertest(app).post('/api/users/logout');

            expect(res.status).to.equal(401);
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('deve retornar 200 ao deletar usuário como admin', async () => {
            sinon.stub(UserService, 'deleteUser').resolves({
                id: 5,
                name: 'Deletado',
                email: 'del@email.com',
                cpf: '12345678900',
                phone: null,
                address: null,
                role: 'CUSTOMER' as any,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const res = await supertest(app)
                .delete('/api/users/5')
                .set('Authorization', `Bearer ${makeAdminToken()}`);

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
        });

        it('deve retornar 400 quando ID é inválido', async () => {
            const res = await supertest(app)
                .delete('/api/users/abc')
                .set('Authorization', `Bearer ${makeAdminToken()}`);

            expect(res.status).to.equal(400);
            expect(res.body.success).to.be.false;
        });

        it('deve retornar 403 quando CUSTOMER tenta deletar', async () => {
            const res = await supertest(app)
                .delete('/api/users/5')
                .set('Authorization', `Bearer ${makeCustomerToken()}`);

            expect(res.status).to.equal(403);
        });

        it('deve retornar 404 quando usuário não encontrado', async () => {
            sinon.stub(UserService, 'deleteUser').rejects(
                new Error('Erro ao deletar usuário: Usuário não encontrado')
            );

            const res = await supertest(app)
                .delete('/api/users/999')
                .set('Authorization', `Bearer ${makeAdminToken()}`);

            expect(res.status).to.equal(404);
            expect(res.body.success).to.be.false;
        });

        it('deve retornar 401 sem token', async () => {
            const res = await supertest(app).delete('/api/users/5');

            expect(res.status).to.equal(401);
        });
    });

    // Teste das rotas de /cart

    describe('GET /api/cart', () => {
        it('deve retornar 200 com carrinho do usuário', async () => {
            sinon.stub(cartService, 'getCart').resolves({
                id: 1,
                userId: 1,
                items: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const res = await supertest(app)
                .get('/api/cart')
                .set('Authorization', `Bearer ${makeCustomerToken()}`);

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
        });

        it('deve retornar 401 sem token', async () => {
            const res = await supertest(app).get('/api/cart');

            expect(res.status).to.equal(401);
        });

        it('deve retornar 403 quando CUSTOMER tenta acessar carrinho de outro', async () => {
            const res = await supertest(app)
                .get('/api/cart?userId=999')
                .set('Authorization', `Bearer ${makeCustomerToken()}`);

            expect(res.status).to.equal(403);
            expect(res.body.success).to.be.false;
        });
    });

    describe('POST /api/cart/items', () => {
        it('deve retornar 200 ao adicionar item ao carrinho', async () => {
            sinon.stub(cartService, 'addToCart').resolves({
                id: 1,
                userId: 1,
                items: [{ productId: 1, quantity: 1 }],
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const res = await supertest(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${makeCustomerToken()}`)
                .send({ productId: 1, quantity: 1 });

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
        });

        it('deve retornar 400 sem productId', async () => {
            const res = await supertest(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${makeCustomerToken()}`)
                .send({ quantity: 1 });

            expect(res.status).to.equal(400);
            expect(res.body.success).to.be.false;
            expect(res.body.message).to.equal('productId é obrigatório');
        });

        it('deve retornar 401 sem token', async () => {
            const res = await supertest(app)
                .post('/api/cart/items')
                .send({ productId: 1, quantity: 1 });

            expect(res.status).to.equal(401);
        });
    });

    describe('PUT /api/cart/items/:productId', () => {
        it('deve retornar 200 ao atualizar quantidade', async () => {
            sinon.stub(cartService, 'updateQuantity').resolves({
                id: 1,
                userId: 1,
                items: [{ productId: 1, quantity: 3 }],
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const res = await supertest(app)
                .put('/api/cart/items/1')
                .set('Authorization', `Bearer ${makeCustomerToken()}`)
                .send({ quantity: 3 });

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
        });

        it('deve retornar 400 com productId inválido', async () => {
            const res = await supertest(app)
                .put('/api/cart/items/abc')
                .set('Authorization', `Bearer ${makeCustomerToken()}`)
                .send({ quantity: 3 });

            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('productId inválido');
        });

        it('deve retornar 400 com quantity menor que 1', async () => {
            const res = await supertest(app)
                .put('/api/cart/items/1')
                .set('Authorization', `Bearer ${makeCustomerToken()}`)
                .send({ quantity: 0 });

            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('Quantidade deve ser no mínimo 1');
        });

        it('deve retornar 401 sem token', async () => {
            const res = await supertest(app)
                .put('/api/cart/items/1')
                .send({ quantity: 3 });

            expect(res.status).to.equal(401);
        });
    });

    describe('DELETE /api/cart/items/:productId', () => {
        it('deve retornar 200 ao remover item', async () => {
            sinon.stub(cartService, 'removeFromCart').resolves({
                id: 1,
                userId: 1,
                items: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const res = await supertest(app)
                .delete('/api/cart/items/1')
                .set('Authorization', `Bearer ${makeCustomerToken()}`);

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
        });

        it('deve retornar 400 com productId inválido', async () => {
            const res = await supertest(app)
                .delete('/api/cart/items/abc')
                .set('Authorization', `Bearer ${makeCustomerToken()}`);

            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('productId inválido');
        });

        it('deve retornar 401 sem token', async () => {
            const res = await supertest(app).delete('/api/cart/items/1');

            expect(res.status).to.equal(401);
        });
    });

    describe('DELETE /api/cart', () => {
        it('deve retornar 200 ao limpar carrinho', async () => {
            sinon.stub(cartService, 'clearCart').resolves({
                id: 1,
                userId: 1,
                items: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const res = await supertest(app)
                .delete('/api/cart')
                .set('Authorization', `Bearer ${makeCustomerToken()}`);

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
        });

        it('deve retornar 401 sem token', async () => {
            const res = await supertest(app).delete('/api/cart');

            expect(res.status).to.equal(401);
        });
    });

    // Teste das rotas de /orders

    describe('GET /api/orders', () => {
        it('deve retornar 200 com pedidos do usuário', async () => {
            sinon.stub(orderService, 'getOrdersByUser').resolves([]);

            const res = await supertest(app)
                .get('/api/orders')
                .set('Authorization', `Bearer ${makeCustomerToken()}`);

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body.data).to.be.an('array');
        });

        it('deve retornar 401 sem token', async () => {
            const res = await supertest(app).get('/api/orders');

            expect(res.status).to.equal(401);
        });
    });

    describe('POST /api/orders', () => {
        it('deve retornar 201 ao criar pedido', async () => {
            sinon.stub(orderService, 'createOrder').resolves({
                id: 1,
                userId: 1,
                status: 'PENDING',
                shippingAddress: 'Rua Teste, 123',
                totalPrice: 59.98,
                items: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const res = await supertest(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${makeCustomerToken()}`)
                .send({ shippingAddress: 'Rua Teste, 123' });

            expect(res.status).to.equal(201);
            expect(res.body.success).to.be.true;
        });

        it('deve retornar 400 sem shippingAddress', async () => {
            const res = await supertest(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${makeCustomerToken()}`)
                .send({});

            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('Endereço de entrega é obrigatório');
        });

        it('deve retornar 401 sem token', async () => {
            const res = await supertest(app)
                .post('/api/orders')
                .send({ shippingAddress: 'Rua Teste' });

            expect(res.status).to.equal(401);
        });
    });

    describe('GET /api/orders/:id', () => {
        it('deve retornar 200 ao buscar pedido do próprio usuário', async () => {
            sinon.stub(orderService, 'getOrderById').resolves({
                id: 1,
                userId: 1,
                status: 'PENDING',
                shippingAddress: 'Rua Teste',
                totalPrice: 59.98,
                items: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const res = await supertest(app)
                .get('/api/orders/1')
                .set('Authorization', `Bearer ${makeCustomerToken()}`);

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
        });

        it('deve retornar 400 com ID inválido', async () => {
            const res = await supertest(app)
                .get('/api/orders/abc')
                .set('Authorization', `Bearer ${makeCustomerToken()}`);

            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('ID do pedido inválido');
        });

        it('deve retornar 404 quando pedido não existe', async () => {
            sinon.stub(orderService, 'getOrderById').resolves(null);

            const res = await supertest(app)
                .get('/api/orders/999')
                .set('Authorization', `Bearer ${makeCustomerToken()}`);

            expect(res.status).to.equal(404);
        });

        it('deve retornar 403 quando CUSTOMER tenta acessar pedido de outro', async () => {
            sinon.stub(orderService, 'getOrderById').resolves({
                id: 1,
                userId: 999,
                status: 'PENDING',
                shippingAddress: 'Rua Teste',
                totalPrice: 59.98,
                items: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const res = await supertest(app)
                .get('/api/orders/1')
                .set('Authorization', `Bearer ${makeCustomerToken()}`);

            expect(res.status).to.equal(403);
        });

        it('deve retornar 401 sem token', async () => {
            const res = await supertest(app).get('/api/orders/1');

            expect(res.status).to.equal(401);
        });
    });

    describe('GET /api/orders/all', () => {
        it('deve retornar 200 com todos os pedidos para admin', async () => {
            sinon.stub(orderService, 'getAllOrders').resolves([]);

            const res = await supertest(app)
                .get('/api/orders/all')
                .set('Authorization', `Bearer ${makeAdminToken()}`);

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
        });

        it('deve retornar 403 para CUSTOMER', async () => {
            const res = await supertest(app)
                .get('/api/orders/all')
                .set('Authorization', `Bearer ${makeCustomerToken()}`);

            expect(res.status).to.equal(403);
        });

        it('deve retornar 401 sem token', async () => {
            const res = await supertest(app).get('/api/orders/all');

            expect(res.status).to.equal(401);
        });
    });

    describe('PATCH /api/orders/:id/status', () => {
        it('deve retornar 200 ao atualizar status como admin', async () => {
            sinon.stub(orderService, 'updateOrderStatus').resolves({
                id: 1,
                userId: 1,
                status: 'PROCESSING',
                shippingAddress: 'Rua Teste',
                totalPrice: 59.98,
                items: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const res = await supertest(app)
                .patch('/api/orders/1/status')
                .set('Authorization', `Bearer ${makeAdminToken()}`)
                .send({ status: 'PROCESSING' });

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
        });

        it('deve retornar 400 com ID inválido', async () => {
            const res = await supertest(app)
                .patch('/api/orders/abc/status')
                .set('Authorization', `Bearer ${makeAdminToken()}`)
                .send({ status: 'PROCESSING' });

            expect(res.status).to.equal(400);
        });

        it('deve retornar 400 sem status no body', async () => {
            const res = await supertest(app)
                .patch('/api/orders/1/status')
                .set('Authorization', `Bearer ${makeAdminToken()}`)
                .send({});

            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('status é obrigatório');
        });

        it('deve retornar 403 para CUSTOMER', async () => {
            const res = await supertest(app)
                .patch('/api/orders/1/status')
                .set('Authorization', `Bearer ${makeCustomerToken()}`)
                .send({ status: 'PROCESSING' });

            expect(res.status).to.equal(403);
        });
    });

    describe('DELETE /api/orders/:id', () => {
        it('deve retornar 200 ao deletar pedido como admin', async () => {
            sinon.stub(orderService, 'deleteOrder').resolves(true);

            const res = await supertest(app)
                .delete('/api/orders/1')
                .set('Authorization', `Bearer ${makeAdminToken()}`);

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
        });

        it('deve retornar 400 com ID inválido', async () => {
            const res = await supertest(app)
                .delete('/api/orders/abc')
                .set('Authorization', `Bearer ${makeAdminToken()}`);

            expect(res.status).to.equal(400);
        });

        it('deve retornar 404 quando pedido não encontrado', async () => {
            sinon.stub(orderService, 'deleteOrder').resolves(false);

            const res = await supertest(app)
                .delete('/api/orders/999')
                .set('Authorization', `Bearer ${makeAdminToken()}`);

            expect(res.status).to.equal(404);
        });

        it('deve retornar 403 para CUSTOMER', async () => {
            const res = await supertest(app)
                .delete('/api/orders/1')
                .set('Authorization', `Bearer ${makeCustomerToken()}`);

            expect(res.status).to.equal(403);
        });

        it('deve retornar 401 sem token', async () => {
            const res = await supertest(app).delete('/api/orders/1');

            expect(res.status).to.equal(401);
        });
    });

    // Testes gerais da API

    describe('Rota inexistente', () => {
        it('deve retornar 404 para rota não definida', async () => {
            const res = await supertest(app).get('/api/rota-que-nao-existe');

            expect(res.status).to.equal(404);
            expect(res.body.error.message).to.equal('Rota não encontrada');
        });
    });

    describe('GET /api-docs.json', () => {
        it('deve retornar spec OpenAPI', async () => {
            const res = await supertest(app).get('/api-docs.json');

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('openapi');
        });
    });

    describe('Error handler global', () => {
        it('deve retornar 500 quando controller lança erro não tratado', async () => {
            sinon.stub(productService, 'getAllProducts').rejects(new Error('Erro inesperado'));

            const res = await supertest(app).get('/api/products');

            expect(res.status).to.equal(500);
            expect(res.body.error).to.have.property('message');
        });
    });
});
