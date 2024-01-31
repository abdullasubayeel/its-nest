import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { ProjectModule } from './project/project.module';
import { TicketModule } from './ticket/ticket.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from './logger/logger.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ProductModule,
    ProjectModule,
    TicketModule,
    UserModule,
    DatabaseModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,
        limit: 3,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    LoggerModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
