if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não está definido. Configure-o no arquivo .env');
}

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export default {
    port: parseInt(process.env.PORT || '3000'),
    environment: process.env.NODE_ENV || 'development',

    jwt: {
        secret: JWT_SECRET,
        expiresIn: JWT_EXPIRES_IN,
    },
};
