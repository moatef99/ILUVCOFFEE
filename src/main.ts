import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createConnection } from 'typeorm';

async function bootstrap() {
  //run migration scripts
  if (process.env.TYPEORM_MIGRATIONS_RUN === 'true') {
    let connection = null;
    try {
      connection = await createConnection({
        type: 'postgres',
        host: process.env.TYPEORM_HOST,
        port: +process.env.TYPEORM_PORT,
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        database: process.env.TYPEORM_DATABASE,
        entities: [process.env.TYPEORM_ENTITIES],
        migrations: [process.env.TYPEORM_MIGRATIONS],
        cli: {
          migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR
        }
      });
      await connection.runMigrations();
      await connection.close();
    } catch (error) {
      //TODO: add to the log service
      console.log('Error while connecting to the database', error);
      return error;
    }
  }

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  await app.listen(3001);
}
bootstrap();
