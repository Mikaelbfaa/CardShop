import { Router } from 'express';
import * as UserController from '../controllers/user';
import AuthMiddleware from '../middleware/auth';
import RateLimitMiddleware from '../middleware/rateLimit';
import ValidationMiddleware from '../middleware/validation';

const router = Router();

router.post(
    '/register',
    RateLimitMiddleware.strict,
    ValidationMiddleware.validateRequiredFields(['name', 'email', 'password', 'cpf']),
    UserController.registerUser
);

router.post(
    '/login',
    RateLimitMiddleware.strict,
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

router.get(
    '/',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isAdmin,
    UserController.getAllUsers
);

router.patch(
    '/:id/role',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isAdmin,
    ValidationMiddleware.validateRequiredFields(['role']),
    UserController.updateUserRole
);

router.delete(
    '/:id',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isAdmin,
    UserController.deleteUser
);

export default router;
