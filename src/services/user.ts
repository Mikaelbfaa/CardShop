import UserRepository, { CreateUserInput } from '../repository/user';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/server';

class UserService {
    /**
     * Cadastra um novo usuário no sistema
     */
    async registerNewUser(userData: CreateUserInput): Promise<Omit<User, 'password'>> {
        try {
            const existingUser = await UserRepository.findByEmail(userData.email);
            if (existingUser) {
                throw new Error('E-mail já registrado.');
            }

            const SALT_ROUNDS = 10;
            const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

            const newUser = await UserRepository.create({
                ...userData,
                password: hashedPassword,
            });

            return newUser;
        } catch (error) {
            throw new Error(`Erro ao cadastrar usuário: ${(error as Error).message}`);
        }
    }

    /**
     * Autentica o usuário e gera o token JWT
     * @returns Token JWT e dados do usuário.
     * @throws Error se as credenciais forem inválidas.
     */
    async authenticateUser(
        email: string,
        password: string
    ): Promise<{ token: string; user: Omit<User, 'password'> }> {
        try {
            const user = await UserRepository.findByEmail(email);

            if (!user) {
                throw new Error('Credenciais inválidas.');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                throw new Error('Credenciais inválidas.');
            }

            const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
                expiresIn: JWT_EXPIRES_IN as string,
            } as jwt.SignOptions);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password: _pwd, ...userWithoutPassword } = user;

            return { token, user: userWithoutPassword };
        } catch (error) {
            throw new Error(`Erro ao autenticar usuário: ${(error as Error).message}`);
        }
    }

    /**
     * Busca o perfil de um usuário pelo ID
     * @throws Error se o userId for inválido ou se o usuário não for encontrado.
     */
    async findUserById(userId: number): Promise<Omit<User, 'password'> | null> {
        try {
            if (!userId) {
                throw new Error('userId é obrigatório');
            }
            return UserRepository.findById(userId);
        } catch (error) {
            throw new Error(`Erro ao buscar perfil: ${(error as Error).message}`);
        }
    }

    /**
     * Atualiza o perfil do usuário
     * @throws Error em caso de falha na atualização ou criptografia.
     */
    async updateUserProfile(
        userId: number,
        updateData: Partial<CreateUserInput>
    ): Promise<Omit<User, 'password'>> {
        try {
            if (!userId) {
                throw new Error('userId é obrigatório');
            }

            const existingUser = await UserRepository.findById(userId);
            if (!existingUser) {
                throw new Error('Usuário não encontrado');
            }

            const dataToUpdate: Partial<CreateUserInput> = { ...updateData };

            if (dataToUpdate.password) {
                const SALT_ROUNDS = 10;
                dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, SALT_ROUNDS);
            }

            const updatedUser = await UserRepository.update(userId, dataToUpdate);
            return updatedUser;
        } catch (error) {
            throw new Error(`Erro ao atualizar perfil: ${(error as Error).message}`);
        }
    }

    /**
     * Deleta um usuário pelo ID (admin)
     * @throws Error se o usuário não for encontrado.
     */
    async deleteUser(userId: number): Promise<Omit<User, 'password'>> {
        try {
            if (!userId) {
                throw new Error('userId é obrigatório');
            }

            const existingUser = await UserRepository.findById(userId);
            if (!existingUser) {
                throw new Error('Usuário não encontrado');
            }

            return await UserRepository.delete(userId);
        } catch (error) {
            throw new Error(`Erro ao deletar usuário: ${(error as Error).message}`);
        }
    }
}

export default new UserService();
