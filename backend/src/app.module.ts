import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
// import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
// import { PostsModule } from './modules/posts/posts.module';

// import { Post } from './modules/posts/entities/post.entity';

import { AreaModule } from './modules/area/area.module';
import { AreaService } from './modules/area/area.service';

import { CityModule } from './modules/city/city.module';
import { CityService } from './modules/city/services/city.service';
import { CountryModule } from './modules/country/country.module';
import { CountryService } from './modules/country/services/country.service';
import { EventModule } from './modules/event/event.module';

import { User } from './modules/user/entities/user.entity';
import { RefreshToken } from './modules/auth/entities/refresh-token.entity';
import { Area } from './modules/area/entities/area.entity';
import { City } from './modules/city/entities/city.entity';
import { EventModel } from './modules/event/event/entities/event.entity';
import { Activity } from './modules/event/activity/entities/activity.entity';
import { ActivityJury } from './modules/event/activity/entities/activity-jury.entity';
import { EventUser } from './modules/event/event-user/entities/event-user.entity';
import { Invite } from './modules/event/invite/entities/invite.entity';

const models = [
  User,
  RefreshToken,
  Area,
  City,
  EventModel,
  Activity,
  ActivityJury,
  EventUser,
  Invite,
];

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
        // Позже лучше будет: synchronize: false

        synchronize: true,
        /*, Post */
        models: models,
        sync: {
          alter: true,
          // force: true
        },
        logging: false,
      }),
      inject: [ConfigService],
    }),

    // Словари
    AreaModule,
    CityModule,
    CountryModule,
    // Бизнес-модули
    AuthModule,
    UserModule,
    EventModule,

    // PostsModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly areaService: AreaService,
    private readonly cityService: CityService,
    private readonly countryService: CountryService,
  ) {}

  async onModuleInit() {
    await this.areaService.seed();
    await this.cityService.seed();
    await this.countryService.seed();
  }
}
