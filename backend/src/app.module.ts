import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import * as pg from 'pg';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';

@Module({
    imports: [
        // Конфигурация
        ConfigModule.forRoot({
            isGlobal: true,
            load: [databaseConfig, appConfig],
        }),

        // База данных
        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                ...configService.get('database'),
                dialectModule: pg,
                autoLoadModels: true,
                // synchronize: process.env.NODE_ENV === 'development',
                synchronize: true,
                logging: console.log,
            }),
            inject: [ConfigService],
        }),

        // Бизнес-модули
        AuthModule,
        UsersModule,
        PostsModule,
    ],
})
export class AppModule {}
