export default {
    port: parseInt(process.env.PORT || '3000'),
    environment: process.env.NODE_ENV || 'development',

    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        name: process.env.DB_NAME || 'cardshop',
        user: process.env.DB_USER || 'mikael',
        password: process.env.DB_PASSWORD || 'ufcg123'
    },

    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    }
};
