import { OpenAPIV3 } from 'openapi-types';
import { schemas } from './schemas';
import { paths } from './paths';

export const components: OpenAPIV3.ComponentsObject = {
    schemas,
    securitySchemes: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Token JWT obtido no endpoint POST /api/users/login',
        },
    },
};

export { paths };
