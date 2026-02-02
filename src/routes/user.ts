import { Router } from 'express';
import * as UserController from '../controllers/user';
import AuthMiddleware from '../middleware/auth';
import ValidationMiddleware from '../middleware/validation';

const router = Router();

router.post(
    '/register',
    ValidationMiddleware.validateRequiredFields(['name', 'email', 'password', 'cpf']),
    UserController.registerUser
);

router.post(
    '/login',
    ValidationMiddleware.validateRequiredFields(['email', 'password']),
    UserController.loginUser
);

router.get('/profile', AuthMiddleware.verifyToken, UserController.getUserProfile);

router.patch(
    '/profile',
    AuthMiddleware.verifyToken,
    ValidationMiddleware.validateBody,
    UserController.updateUserProfile
);

router.post('/logout', AuthMiddleware.verifyToken, UserController.logoutUser);

router.delete(
    '/:id',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isAdmin,
    UserController.deleteUser
);

export default router;
