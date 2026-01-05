import { registerAs } from '@nestjs/config';
import * as path from 'path';

export default registerAs('database', () => ({
    dialect: process.env.DB_DIALECT || 'sqlite',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || path.join(__dirname, '..', '..', 'database.sqlite'),
    autoLoadModels: true,
    synchronize: process.env.NODE_ENV === 'development', // Только для разработки!
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
}));
