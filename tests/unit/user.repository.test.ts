import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../src/database/prisma';
import UserRepository from '../../src/repository/user';

describe('UserRepository', () => {
    let originalUser: any;

    beforeEach(() => {
        originalUser = (prisma as any).user;
    });

    afterEach(() => {
        (prisma as any).user = originalUser;
        sinon.restore();
    });

    describe('create', () => {
        it('deve criar um usuário com sucesso', async () => {
            const userData = {
                email: 'teste@email.com',
                password: 'hashed_password',
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
                role: 'CUSTOMER',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma as any).user = {
                create: sinon.stub().resolves(createdUser),
            };

            const result = await UserRepository.create(userData);

            expect(result).to.deep.equal(createdUser);
            expect(result).to.not.have.property('password');
        });
    });

    describe('findByEmail', () => {
        it('deve retornar usuário com senha quando encontrado', async () => {
            const user = {
                id: 1,
                email: 'teste@email.com',
                password: 'hashed',
                name: 'Teste',
                cpf: '12345678900',
            };

            (prisma as any).user = {
                findUnique: sinon.stub().resolves(user),
            };

            const result = await UserRepository.findByEmail('teste@email.com');

            expect(result).to.not.be.null;
            expect(result!.email).to.equal('teste@email.com');
            expect(result).to.have.property('password');
        });

        it('deve retornar null quando não encontrado', async () => {
            (prisma as any).user = {
                findUnique: sinon.stub().resolves(null),
            };

            const result = await UserRepository.findByEmail('inexistente@email.com');

            expect(result).to.be.null;
        });
    });

    describe('findById', () => {
        it('deve retornar usuário sem senha quando encontrado', async () => {
            const user = {
                id: 1,
                email: 'teste@email.com',
                name: 'Teste',
                cpf: '12345678900',
                phone: null,
                address: null,
                role: 'CUSTOMER',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma as any).user = {
                findUnique: sinon.stub().resolves(user),
            };

            const result = await UserRepository.findById(1);

            expect(result).to.not.be.null;
            expect(result!.id).to.equal(1);
            expect(result).to.not.have.property('password');
        });

        it('deve retornar null quando não encontrado', async () => {
            (prisma as any).user = {
                findUnique: sinon.stub().resolves(null),
            };

            const result = await UserRepository.findById(999);

            expect(result).to.be.null;
        });
    });

    describe('update', () => {
        it('deve atualizar usuário com sucesso', async () => {
            const updatedUser = {
                id: 1,
                email: 'novo@email.com',
                name: 'Novo Nome',
                cpf: '12345678900',
                phone: null,
                address: null,
                role: 'CUSTOMER',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma as any).user = {
                update: sinon.stub().resolves(updatedUser),
            };

            const result = await UserRepository.update(1, { email: 'novo@email.com', name: 'Novo Nome' });

            expect(result.email).to.equal('novo@email.com');
            expect(result.name).to.equal('Novo Nome');
        });
    });

    describe('delete', () => {
        it('deve deletar usuário com sucesso', async () => {
            const deletedUser = {
                id: 1,
                email: 'teste@email.com',
                name: 'Teste',
                cpf: '12345678900',
                phone: null,
                address: null,
                role: 'CUSTOMER',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma as any).user = {
                delete: sinon.stub().resolves(deletedUser),
            };

            const result = await UserRepository.delete(1);

            expect(result.id).to.equal(1);
            expect(result).to.not.have.property('password');
        });
    });
});
