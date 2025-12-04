import prisma from '../database/prisma';
import { User, Role, Prisma } from '@prisma/client';

export interface CreateUserInput {
    email: string;
    password: string;
    name: string;
    role?: Role;
}

class UserRepository {
    private userSelectFields = {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
    };

    async create(data: CreateUserInput): Promise<Omit<User, 'password'>> {
        return prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
                name: data.name,
                role: data.role || Role.CUSTOMER,
            },
            select: this.userSelectFields,
        }) as Promise<Omit<User, 'password'>>;
    }

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: number): Promise<Omit<User, 'password'> | null> {
        return prisma.user.findUnique({
            where: { id },
            select: this.userSelectFields,
        }) as Promise<Omit<User, 'password'> | null>;
    }

    async update(id: number, data: Prisma.UserUpdateInput): Promise<Omit<User, 'password'>> {
        return prisma.user.update({
            where: { id },
            data,
            select: this.userSelectFields,
        }) as Promise<Omit<User, 'password'>>;
    }
}

export default new UserRepository();