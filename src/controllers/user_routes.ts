import { Router } from 'express';
import * as UserController from './user.controller';
import AuthMiddleware from '../middleware/auth'; // Importa a instância da classe de Autenticação
import ValidationMiddleware from '../middleware/validation'; // Importa a instância da classe de Validação

const router = Router();

// Rotas de autenticação

// RF01: POST /register
router.post(
    '/register', 
    ValidationMiddleware.validateRequiredFields(['name', 'email', 'password']), 
    UserController.registerUser
);

// RF02: POST /login
router.post(
    '/login', 
    ValidationMiddleware.validateRequiredFields(['email', 'password']), 
    UserController.loginUser
);

// Rotas do perfil

// Middleware de Autenticação (AuthMiddleware.verifyToken) é aplicado em todas as rotas de perfil.

// RF05: GET /profile
router.get(
    '/profile', 
    AuthMiddleware.verifyToken, 
    UserController.getUserProfile
);

// RF06: PATCH /profile
router.patch(
    '/profile', 
    AuthMiddleware.verifyToken, 
    ValidationMiddleware.validateBody, // Checa se o corpo não está vazio
    UserController.updateUserProfile
);

// RF03: POST /logout
router.post(
    '/logout', 
    AuthMiddleware.verifyToken, 
    UserController.logoutUser
);


/*
// Exemplo: Listar todos os usuários (requer Admin)
router.get(
    '/', 
    AuthMiddleware.verifyToken, 
    AuthMiddleware.isAdmin, 
    UserController.getAllUsers
);
*/

export default router;