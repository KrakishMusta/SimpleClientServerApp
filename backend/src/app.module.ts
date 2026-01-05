import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
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
                models: [], // Автозагрузка через autoLoadModels
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
