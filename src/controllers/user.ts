import { Request, Response } from 'express';
import UserService from '../services/user.service';
import { User } from '@prisma/client';

// Interface para injetar dados do JWT na requisição (do middleware)
interface AuthenticatedRequest extends Request {
    userId?: number;
    userRole?: User['role'];
}

// cadastro de usuário

/**
 * Cadastra um novo usuário no sistema.
 */
export const registerUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, email, password } = req.body;
        
        // Chamada direta ao Service (validações básicas de campos vazios foram movidas para o ValidationMiddleware)
        const newUser = await UserService.registerNewUser({ name, email, password });

        return res.status(201).json({ 
            id: newUser.id, 
            name: newUser.name, 
            email: newUser.email, 
            message: 'Usuário cadastrado com sucesso.' 
        });

    } catch (error: any) {
        // Trata erro de e-mail já existente (409) ou erro interno (500)
        const status = error.message.includes('E-mail já registrado') ? 409 : 500;
        return res.status(status).json({ message: error.message || 'Erro interno ao cadastrar usuário.' });
    }
};

// Login do usuário

/**
 * Autentica o usuário e retorna o token JWT.
 */
export const loginUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;
        
        // Chamada ao Service para autenticar e gerar o JWT
        const { token, user } = await UserService.authenticateUser(email, password);

        return res.status(200).json({ 
            token, 
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role 
            } 
        });

    } catch (error: any) {
        // Trata erro de credenciais inválidas (401)
        const status = error.message.includes('Credenciais inválidas') ? 401 : 500;
        return res.status(status).json({ message: error.message || 'Erro interno ao realizar login.' });
    }
};

// Visualiza o perfil

/**
 * Retorna os dados do usuário logado.
 */
export const getUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    // O userId vem do token, injetado pelo middleware 'verifyToken'
    const userId = req.userId; 

    if (!userId) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    try {
        const user = await UserService.findUserById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Perfil de usuário não encontrado.' });
        }

        return res.status(200).json(user);

    } catch (error: any) {
        return res.status(500).json({ message: 'Erro ao buscar perfil.' });
    }
};

// Edita o perfil

/**
 * Atualiza o nome, email ou senha do perfil do usuário logado.
 */
export const updateUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const userId = req.userId;
    const updateData = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    try {
        const updatedUser = await UserService.updateUserProfile(userId, updateData);

        return res.status(200).json({
            id: updatedUser.id, 
            name: updatedUser.name, 
            email: updatedUser.email, 
            message: 'Perfil atualizado com sucesso.'
        });

    } catch (error: any) {
        const status = error.message.includes('E-mail já registrado') ? 409 : 500;
        return res.status(status).json({ message: error.message || 'Erro interno ao atualizar perfil.' });
    }
};

// Logout 
export const logoutUser = async (_req: Request, res: Response): Promise<Response> => {
    return res.status(200).json({ message: 'Logout realizado com sucesso. (Token deve ser descartado pelo cliente)' });
};