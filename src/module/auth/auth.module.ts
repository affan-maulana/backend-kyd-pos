import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Users } from '../user/entities/users.entity';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from '@common/jwt.strategy';

import { MailService } from '@module/mail/mail.service';
import { Business } from '@module/business/entities/business.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Business]),
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || '2h' },
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService, MailService],
  exports: [AuthService],
})
export class AuthModule {}
