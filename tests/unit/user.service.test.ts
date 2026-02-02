import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcrypt';
import UserRepository from '../../src/repository/user';
import userService from '../../src/services/user';

describe('UserService', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('registerNewUser', () => {
        it('deve cadastrar um novo usuário com sucesso', async () => {
            const userData = {
                email: 'teste@email.com',
                password: 'senha123',
                name: 'Teste',
                cpf: '12345678900',
            };

            const createdUser = {
                id: 1,
                email: userData.email,
                name: userData.name,
                cpf: userData.cpf,
                phone: null,
                address: null,
                role: 'CUSTOMER' as const,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            sinon.stub(UserRepository, 'findByEmail').resolves(null);
            sinon.stub(bcrypt, 'hash' as any).resolves('hashed_password');
            const createStub = sinon.stub(UserRepository, 'create').resolves(createdUser);

            const result = await userService.registerNewUser(userData);

            expect(result).to.deep.equal(createdUser);
            expect(createStub.calledOnce).to.be.true;
            expect(createStub.firstCall.args[0].password).to.equal('hashed_password');
        });

        it('deve lançar erro quando email já está registrado', async () => {
            const existingUser = {
                id: 1,
                email: 'teste@email.com',
                password: 'hashed',
                name: 'Existente',
                cpf: '12345678900',
                phone: null,
                address: null,
                role: 'CUSTOMER' as const,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            sinon.stub(UserRepository, 'findByEmail').resolves(existingUser);

            try {
                await userService.registerNewUser({
                    email: 'teste@email.com',
                    password: 'senha123',
                    name: 'Novo',
                    cpf: '98765432100',
                });
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.equal(
                    'Erro ao cadastrar usuário: E-mail já registrado.'
                );
            }
        });
    });

    describe('authenticateUser', () => {
        it('deve autenticar usuário e retornar token sem senha', async () => {
            const userWithPassword = {
                id: 1,
                email: 'teste@email.com',
                password: 'hashed_password',
                name: 'Teste',
                cpf: '12345678900',
                phone: null,
                address: null,
                role: 'CUSTOMER' as const,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            sinon.stub(UserRepository, 'findByEmail').resolves(userWithPassword);
            sinon.stub(bcrypt, 'compare' as any).resolves(true);

            const result = await userService.authenticateUser('teste@email.com', 'senha123');

            expect(result).to.have.property('token').that.is.a('string');
            expect(result).to.have.property('user');
            expect(result.user).to.not.have.property('password');
            expect(result.user.email).to.equal('teste@email.com');
        });

        it('deve lançar erro com credenciais inválidas quando senha incorreta', async () => {
            const userWithPassword = {
                id: 1,
                email: 'teste@email.com',
                password: 'hashed_password',
                name: 'Teste',
                cpf: '12345678900',
                phone: null,
                address: null,
                role: 'CUSTOMER' as const,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            sinon.stub(UserRepository, 'findByEmail').resolves(userWithPassword);
            sinon.stub(bcrypt, 'compare' as any).resolves(false);

            try {
                await userService.authenticateUser('teste@email.com', 'senha_errada');
                expect.fail('deveria ter lançado erro');
            } catch (error) {
                expect((error as Error).message).to.equal(
                    'Erro ao autenticar usuário: Credenciais inválidas.'
                );
            }
        });
    });
});
