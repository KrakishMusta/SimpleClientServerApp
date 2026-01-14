import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
// import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/users.module';
import { PostsModule } from './modules/posts/posts.module';

import { User } from './modules/user/entities/user.entity';
import { Post } from './modules/posts/entities/post.entity';
import { RefreshToken } from './modules/auth/entities/refresh-token.entity';

@Module({
  imports: [
    // Конфигурация
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),

    // База данных
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('DB_URI'),
        autoLoadModels: true,
        // synchronize: process.env.NODE_ENV === 'development',
        synchronize: true,
        models: [User, Post, RefreshToken],
        sync: {
          alter: true,
          // force: true
        },
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
