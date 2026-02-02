// Setup de ambiente para testes — executado antes de qualquer import do app
process.env.JWT_SECRET = '84ee579713a600120b1c514b7ecb626880bb8f80d51358400db0fd0f9bc90380';
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
