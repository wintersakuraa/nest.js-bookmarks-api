import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function start() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            // remove elements that ae not defined in dto
            whitelist: true,
        }),
    );
    await app.listen(5005);
}

start();
