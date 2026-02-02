import { expect } from 'chai';
import sinon from 'sinon';
import validationMiddleware from '../../src/middleware/validation';

describe('ValidationMiddleware', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('validateId', () => {
        it('deve retornar 400 quando ID não é numérico', () => {
            const req = {
                params: { id: 'abc' },
            } as any;

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            } as any;

            const next = sinon.stub();

            validationMiddleware.validateId(req, res, next);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.include({
                success: false,
                message: 'ID inválido',
            });
            expect(next.called).to.be.false;
        });

        it('deve chamar next quando ID é válido', () => {
            const req = {
                params: { id: '42' },
            } as any;

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            } as any;

            const next = sinon.stub();

            validationMiddleware.validateId(req, res, next);

            expect(next.calledOnce).to.be.true;
            expect(res.status.called).to.be.false;
        });
    });

    describe('validateRequiredFields', () => {
        it('deve retornar 400 com lista de campos ausentes', () => {
            const middleware = validationMiddleware.validateRequiredFields([
                'name',
                'email',
                'password',
                'cpf',
            ]);

            const req = {
                body: { name: 'João' },
            } as any;

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            } as any;

            const next = sinon.stub();

            middleware(req, res, next);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledOnce).to.be.true;

            const response = res.json.firstCall.args[0];
            expect(response.success).to.be.false;
            expect(response.message).to.equal('Campos obrigatórios ausentes');
            expect(response.missingFields).to.deep.equal(['email', 'password', 'cpf']);
            expect(next.called).to.be.false;
        });
    });
});
