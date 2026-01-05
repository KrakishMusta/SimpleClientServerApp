import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    nodeEnv: process.env.NODE_ENV,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3000,
    apiPrefix: process.env.API_PREFIX || 'api',
}));
