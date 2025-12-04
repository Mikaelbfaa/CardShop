import prisma from '../database/prisma';
import { User, Role, Prisma } from '@prisma/client';

/**
 * DTO para criação de usuário.
 */
export interface CreateUserInput {
    email: string;
    password: string;
    name: string;
    cpf: string;
    role?: Role;
}

/**
 * Repository de Usuários.
 * Camada responsável pelo acesso direto aos dados via Prisma.
 */
class UserRepository {
    private userSelectFields = {
        id: true,
        email: true,
        name: true,
        cpf: true,
        role: true,
        createdAt: true,
        updatedAt: true,
    };

    /**
     * Criar novo usuário.
     * @param data - Dados do usuário a ser criado.
     * @returns Usuário criado (sem senha).
     */
    async create(data: CreateUserInput): Promise<Omit<User, 'password'>> {
        return prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
                name: data.name,
                cpf: data.cpf,
                role: data.role || Role.CUSTOMER,
            },
            select: this.userSelectFields,
        }) as Promise<Omit<User, 'password'>>;
    }

    /**
     * Buscar usuário por email (retorna senha para validação).
     * @param email - Email do usuário.
     * @returns Usuário encontrado ou null.
     */
    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    /**
     * Buscar usuário por ID.
     * @param id - ID do usuário.
     * @returns Usuário encontrado (sem senha) ou null.
     */
    async findById(id: number): Promise<Omit<User, 'password'> | null> {
        return prisma.user.findUnique({
            where: { id },
            select: this.userSelectFields,
        }) as Promise<Omit<User, 'password'> | null>;
    }

    /**
     * Atualizar usuário.
     * @param id - ID do usuário.
     * @param data - Dados a serem atualizados.
     * @returns Usuário atualizado (sem senha).
     */
    async update(id: number, data: Prisma.UserUpdateInput): Promise<Omit<User, 'password'>> {
        return prisma.user.update({
            where: { id },
            data,
            select: this.userSelectFields,
        }) as Promise<Omit<User, 'password'>>;
    }

    /**
     * Deletar usuário.
     * @param id - ID do usuário.
     * @returns Usuário deletado (sem senha).
     */
    async delete(id: number): Promise<Omit<User, 'password'>> {
        return prisma.user.delete({
            where: { id },
            select: this.userSelectFields,
        }) as Promise<Omit<User, 'password'>>;
    }
}

export default new UserRepository();
