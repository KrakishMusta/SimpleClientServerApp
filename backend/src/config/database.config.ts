import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_PASSWORD || 'admin123',
    database: process.env.DB_DATABASE || 'simpleapp',
    autoLoadModels: true,
    synchronize: true,
    // synchronize: process.env.NODE_ENV === 'development',  Только для разработки!
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 20,
        min: 5,
        acquire: 30000,
        idle: 10000,
    },
}));
