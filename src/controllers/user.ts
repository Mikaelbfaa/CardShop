import { Request, Response } from 'express';
import UserService from '../services/user';
import { User } from '@prisma/client';

interface AuthenticatedRequest extends Request {
    userId?: number;
    userRole?: User['role'];
}

/**
 * Cadastra um novo usuário no sistema.
 */
export const registerUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, email, password, cpf } = req.body;

        const newUser = await UserService.registerNewUser({ name, email, password, cpf });

        return res.status(201).json({
            success: true,
            message: 'Usuário cadastrado com sucesso',
            data: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                cpf: newUser.cpf,
            },
        });
    } catch (error: unknown) {
        const err = error as Error;
        const status = err.message.includes('E-mail já registrado') ? 409 : 500;
        return res.status(status).json({
            success: false,
            message: err.message || 'Erro interno ao cadastrar usuário',
        });
    }
};

/**
 * Autentica o usuário e retorna o token JWT.
 */
export const loginUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;

        const { token, user } = await UserService.authenticateUser(email, password);

        return res.status(200).json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    } catch (error: unknown) {
        const err = error as Error;
        const status = err.message.includes('Credenciais inválidas') ? 401 : 500;
        return res.status(status).json({
            success: false,
            message: err.message || 'Erro interno ao realizar login',
        });
    }
};

/**
 * Retorna os dados do usuário logado.
 */
export const getUserProfile = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<Response> => {
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: 'Usuário não autenticado',
        });
    }

    try {
        const user = await UserService.findUserById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Perfil de usuário não encontrado',
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: 'Erro ao buscar perfil',
        });
    }
};

/**
 * Atualiza o nome, email ou senha do perfil do usuário logado.
 */
export const updateUserProfile = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<Response> => {
    const userId = req.userId;
    const updateData = req.body;

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: 'Usuário não autenticado',
        });
    }

    try {
        const updatedUser = await UserService.updateUserProfile(userId, updateData);

        return res.status(200).json({
            success: true,
            message: 'Perfil atualizado com sucesso',
            data: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
            },
        });
    } catch (error: unknown) {
        const err = error as Error;
        const status = err.message.includes('E-mail já registrado') ? 409 : 500;
        return res.status(status).json({
            success: false,
            message: err.message || 'Erro interno ao atualizar perfil',
        });
    }
};

/**
 * Realiza o logout do usuário.
 */
export const logoutUser = async (_req: Request, res: Response): Promise<Response> => {
    return res.status(200).json({
        success: true,
        message: 'Logout realizado com sucesso',
    });
};

/**
 * Deleta um usuário pelo ID (admin).
 */
export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
        return res.status(400).json({
            success: false,
            message: 'ID de usuário inválido',
        });
    }

    try {
        const deletedUser = await UserService.deleteUser(userId);

        return res.status(200).json({
            success: true,
            message: 'Usuário deletado com sucesso',
            data: {
                id: deletedUser.id,
                name: deletedUser.name,
                email: deletedUser.email,
            },
        });
    } catch (error: unknown) {
        const err = error as Error;
        const status = err.message.includes('não encontrado') ? 404 : 500;
        return res.status(status).json({
            success: false,
            message: err.message || 'Erro interno ao deletar usuário',
        });
    }
};
