import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot( { ignoreEnvFile: true, isGlobal: true } /* { envFilePath: ['.env.development.local', '.env.development'] } If a variable is found in multiple files, the first one takes precedence. */ )],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
