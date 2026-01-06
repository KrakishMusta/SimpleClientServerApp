import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // CORS
    app.enableCors({
        origin:
            configService.get('app.nodeEnv') === 'development'
                ? ['http://localhost:5173', 'http://localhost:3000']
                : configService.get('app.frontendUrl'),
        credentials: true,
    });

    // Глобальная валидация
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );

    // Swagger документация
    const config = new DocumentBuilder()
        .setTitle('Simple Client Server API')
        .setDescription('API documentation for Simple Client Server App')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    const port = configService.get('app.port');
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(`Swagger docs available at: http://localhost:${port}/docs`);
}
bootstrap();
