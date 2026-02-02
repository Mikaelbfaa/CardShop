import { expect } from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';
import app from '../../src/app';

// Importar os módulos que serão stubados
import productRepository from '../../src/repository/product';
import UserService from '../../src/services/user';

describe('Rotas da API (integração)', () => {
    afterEach(() => {
        sinon.restore();
    });

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
        it('deve retornar 404 quando produto não existe', async () => {
            sinon.stub(productRepository, 'findById').resolves(null);

            const res = await supertest(app).get('/api/products/999');

            expect(res.status).to.equal(404);
            expect(res.body.success).to.be.false;
            expect(res.body.message).to.equal('Produto não encontrado');
        });
    });

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
    });

    describe('POST /api/users/login', () => {
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
    });
});
