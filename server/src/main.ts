import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  let allowedCorsSubdomains:string = configService.get('ALLOWED_CORS_SUBDOMAINS').toString();
  allowedCorsSubdomains = allowedCorsSubdomains.replace(".","\\.")
  allowedCorsSubdomains = "https?:\\/\\/(([^/]+\\.)?" + allowedCorsSubdomains + ")$"
  app.enableCors({
    origin: new RegExp(allowedCorsSubdomains,'i'),  // i.e. /https?:\/\/(([^/]+\.)?example\.com)$/i
  });
  await app.listen(configService.get('NESTJS_APPLICATION_PORT'))
}
bootstrap();
