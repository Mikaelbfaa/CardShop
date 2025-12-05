import { OpenAPIV3 } from 'openapi-types';

const RoleEnum: OpenAPIV3.SchemaObject = {
    type: 'string',
    enum: ['CUSTOMER', 'ADMIN'],
    description: 'Papel do usuário no sistema',
};

export const User: OpenAPIV3.SchemaObject = {
    type: 'object',
    properties: {
        id: {
            type: 'integer',
            description: 'ID único do usuário',
        },
        name: {
            type: 'string',
            description: 'Nome completo do usuário',
        },
        email: {
            type: 'string',
            format: 'email',
            description: 'E-mail do usuário (único)',
        },
        cpf: {
            type: 'string',
            description: 'CPF do usuário (único)',
        },
        phone: {
            type: 'string',
            nullable: true,
            description: 'Telefone do usuário',
        },
        address: {
            type: 'string',
            nullable: true,
            description: 'Endereço do usuário',
        },
        role: {
            ...RoleEnum,
        },
        createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de criação do registro',
        },
        updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data da última atualização',
        },
    },
    required: ['id', 'name', 'email', 'cpf', 'role', 'createdAt', 'updatedAt'],
};

export const CreateUser: OpenAPIV3.SchemaObject = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            description: 'Nome completo do usuário',
        },
        email: {
            type: 'string',
            format: 'email',
            description: 'E-mail do usuário (deve ser único)',
        },
        password: {
            type: 'string',
            format: 'password',
            description: 'Senha do usuário',
        },
        cpf: {
            type: 'string',
            description: 'CPF do usuário (deve ser único)',
        },
    },
    required: ['name', 'email', 'password', 'cpf'],
};

export const UpdateUser: OpenAPIV3.SchemaObject = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            description: 'Nome completo do usuário',
        },
        email: {
            type: 'string',
            format: 'email',
            description: 'E-mail do usuário',
        },
        password: {
            type: 'string',
            format: 'password',
            description: 'Nova senha do usuário',
        },
        phone: {
            type: 'string',
            description: 'Telefone do usuário',
        },
        address: {
            type: 'string',
            description: 'Endereço do usuário',
        },
    },
};

export const LoginRequest: OpenAPIV3.SchemaObject = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            format: 'email',
            description: 'E-mail do usuário',
        },
        password: {
            type: 'string',
            format: 'password',
            description: 'Senha do usuário',
        },
    },
    required: ['email', 'password'],
};

export const LoginResponse: OpenAPIV3.SchemaObject = {
    type: 'object',
    properties: {
        token: {
            type: 'string',
            description: 'Token JWT para autenticação',
        },
        user: {
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                    description: 'ID do usuário',
                },
                name: {
                    type: 'string',
                    description: 'Nome do usuário',
                },
                email: {
                    type: 'string',
                    description: 'E-mail do usuário',
                },
                role: {
                    ...RoleEnum,
                },
            },
        },
    },
};

export const userSchemas = {
    User,
    CreateUser,
    UpdateUser,
    LoginRequest,
    LoginResponse,
};
