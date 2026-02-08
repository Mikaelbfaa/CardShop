import { expect } from 'chai';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import authMiddleware from '../../src/middleware/auth';

describe('AuthMiddleware', () => {
    describe('verifyToken', () => {
        it('deve retornar 401 quando header Authorization está ausente', async () => {
            const req = {
                headers: {},
            } as any;

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            } as any;

            const next = sinon.stub();

            await authMiddleware.verifyToken(req, res, next);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.include({
                success: false,
                message: 'Acesso negado. Token não fornecido.',
            });
            expect(next.called).to.be.false;
        });

        it('deve retornar 401 quando Authorization não contém Bearer', async () => {
            const req = {
                headers: {
                    authorization: 'Basic some-token',
                },
            } as any;

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            } as any;

            const next = sinon.stub();

            await authMiddleware.verifyToken(req, res, next);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.include({
                success: false,
                message: 'Formato do token inválido.',
            });
            expect(next.called).to.be.false;
        });

        it('deve retornar 401 quando token está vazio após Bearer', async () => {
            const req = {
                headers: {
                    authorization: 'Bearer ',
                },
            } as any;

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            } as any;

            const next = sinon.stub();

            await authMiddleware.verifyToken(req, res, next);

            expect(res.status.calledWith(401)).to.be.true;
            expect(next.called).to.be.false;
        });

        it('deve retornar 401 quando token é inválido/expirado', async () => {
            const req = {
                headers: {
                    authorization: 'Bearer invalid-token-here',
                },
            } as any;

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            } as any;

            const next = sinon.stub();

            await authMiddleware.verifyToken(req, res, next);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.include({
                success: false,
                message: 'Token inválido ou expirado.',
            });
            expect(next.called).to.be.false;
        });

        it('deve injetar userId e chamar next() com token válido', async () => {
            const token = jwt.sign(
                { userId: 42, role: 'CUSTOMER' },
                process.env.JWT_SECRET as string,
                { expiresIn: '1h' }
            );

            const req = {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            } as any;

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            } as any;

            const next = sinon.stub();

            await authMiddleware.verifyToken(req, res, next);

            expect(next.calledOnce).to.be.true;
            expect(req.userId).to.equal(42);
            expect(req.userRole).to.equal('CUSTOMER');
        });
    });

    describe('isAdmin', () => {
        it('deve chamar next() quando role é ADMIN', async () => {
            const req = {
                userRole: 'ADMIN',
            } as any;

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            } as any;

            const next = sinon.stub();

            await authMiddleware.isAdmin(req, res, next);

            expect(next.calledOnce).to.be.true;
            expect(res.status.called).to.be.false;
        });

        it('deve retornar 403 quando role é CUSTOMER', async () => {
            const req = {
                userRole: 'CUSTOMER',
            } as any;

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            } as any;

            const next = sinon.stub();

            await authMiddleware.isAdmin(req, res, next);

            expect(res.status.calledWith(403)).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.include({
                success: false,
                message: 'Acesso negado. Requer privilégios de Administrador.',
            });
            expect(next.called).to.be.false;
        });
    });
});
