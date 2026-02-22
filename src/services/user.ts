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
            // Verifica duplicidade de email antes de criar (campo unique no banco)
            const existingUser = await UserRepository.findByEmail(userData.email);
            if (existingUser) {
                throw new Error('E-mail já registrado.');
            }

            // bcrypt salt rounds: custo computacional do hash (10 = ~10 hashes/sec, bom equilíbrio)
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

            // Mensagem idêntica para usuário não encontrado e senha incorreta:
            // previne enumeração de usuários (atacante não descobre quais emails existem)
            if (!user) {
                throw new Error('Credenciais inválidas.');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                throw new Error('Credenciais inválidas.');
            }

            // Payload do JWT inclui userId e role para autorização nas rotas protegidas
            const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
                expiresIn: JWT_EXPIRES_IN as string,
            } as jwt.SignOptions);

            // Desestrutura para remover senha antes de retornar os dados do usuário
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
            // Retorno sem await: erros do repositório NÃO são capturados pelo try-catch,
            // propagando com a mensagem original (sem o prefixo 'Erro ao buscar perfil:')
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
            // Validação de parâmetro obrigatório
            if (!userId) {
                throw new Error('userId é obrigatório');
            }

            // Garante que o usuário existe antes de tentar atualizar
            const existingUser = await UserRepository.findById(userId);
            if (!existingUser) {
                throw new Error('Usuário não encontrado');
            }

            // Cópia dos dados para não mutar o objeto original
            const dataToUpdate: Partial<CreateUserInput> = { ...updateData };

            // Aplica hash na senha apenas se ela foi incluída na atualização
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
            // Validação de parâmetro obrigatório
            if (!userId) {
                throw new Error('userId é obrigatório');
            }

            // Garante que o usuário existe antes de tentar deletar
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
