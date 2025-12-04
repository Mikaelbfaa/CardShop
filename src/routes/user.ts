import { Router } from 'express';
import * as UserController from '../controllers/user';
import AuthMiddleware from '../middleware/auth';
import ValidationMiddleware from '../middleware/validation';

const router = Router();

/** @swagger
 * /api/users/register:
 *   post:
 *     summary: Cadastrar novo usuário
 *     tags: [Users]
 */
router.post(
    '/register',
    ValidationMiddleware.validateRequiredFields(['name', 'email', 'password', 'cpf']),
    UserController.registerUser
);

/** @swagger
 * /api/users/login:
 *   post:
 *     summary: Login do usuário
 *     tags: [Users]
 */
router.post(
    '/login',
    ValidationMiddleware.validateRequiredFields(['email', 'password']),
    UserController.loginUser
);

/** @swagger
 * /api/users/profile:
 *   get:
 *     summary: Visualizar perfil do usuário
 *     tags: [Users]
 */
router.get('/profile', AuthMiddleware.verifyToken, UserController.getUserProfile);

/** @swagger
 * /api/users/profile:
 *   patch:
 *     summary: Atualizar perfil do usuário
 *     tags: [Users]
 */
router.patch(
    '/profile',
    AuthMiddleware.verifyToken,
    ValidationMiddleware.validateBody,
    UserController.updateUserProfile
);

/** @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout do usuário
 *     tags: [Users]
 */
router.post('/logout', AuthMiddleware.verifyToken, UserController.logoutUser);

export default router;
