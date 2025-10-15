import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Users } from '../user/entities/users.entity';
import { MailService } from '@module/mail/mail.service';
import { Business } from '@module/business/entities/business.entity';
import { LoginDto, RegisterDto } from './dto/request-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,

    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,

    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const user = await this.usersRepository.findOne({
        where: { email: loginDto.email },
        select: ['id', 'email', 'name', 'passwordHash'],
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isMatch = await bcrypt.compare(
        loginDto.password,
        user?.passwordHash,
      );

      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const business = await this.businessRepository.findOne({
        where: { userId: user.id, businessTypeId: loginDto.businessTypeId },
      });

      if (!business) {
        throw new UnauthorizedException('Invalid business');
      }

      const dataToEncode = {
        email: loginDto.email,
        id: user.id,
        businessId: business?.id,
      };

      console.log('dataToEncode', dataToEncode);

      const accessToken = this.jwtService.sign(dataToEncode, {
        expiresIn: process.env.JWT_EXPIRATION || '2h',
      });

      const refreshToken = this.jwtService.sign(dataToEncode, {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
      });

      // remove passwordHash from user object
      delete user.passwordHash;

      return {
        result: { user: user, token: accessToken, refreshToken: refreshToken },
      };
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const newAccessToken = this.jwtService.sign(
        {
          id: payload.id,
          email: payload.email,
        },
        { expiresIn: '2h' },
      );

      const newRefreshToken = this.jwtService.sign(
        { id: payload.id, email: payload.email },
        { expiresIn: '7d' },
      );

      return {
        result: {
          token: newAccessToken,
          refreshToken: newRefreshToken,
        },
        message: 'Token refreshed successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      if (!user) throw new NotFoundException('User not found');

      const token = this.jwtService.sign({ email }, { expiresIn: '1h' });
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      await this.mailService.sendForgotPassword(email, resetLink);

      return {
        result: null,
        message: 'Reset password link sent to your email.',
      };
    } catch (error) {
      throw error;
    }
  }

  async register(data: RegisterDto) {
    // Check for existing email
    const existingEmail = await this.usersRepository.findOne({
      select: ['email'],
      where: {
        email: data.email,
      },
    });
    if (existingEmail) {
      throw new UnauthorizedException('Email already exists');
    }

    // Check for existing phone
    const existingPhone = await this.usersRepository.findOne({
      select: ['phone'],
      where: {
        phone: data.phone,
      },
    });
    if (existingPhone) {
      throw new UnauthorizedException('Phone number already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = this.usersRepository.create({
      email: data.email,
      passwordHash: hashedPassword,
      name: data.name,
      phone: data.phone,
    });
    await this.usersRepository.save(newUser);

    // create business
    const newBusiness = this.businessRepository.create({
      name: data.businessName,
      businessTypeId: data.businessTypeId,
      userId: newUser.id,
    });
    await this.businessRepository.save(newBusiness);

    return {
      statusCode: 201,
      result: { id: newUser.id, email: newUser.email },
      message: 'Registration successful',
    };
  }

  async resetPassword(newPassword: string, token: string) {
    try {
      const payload = this.jwtService.verify(token);

      const user = await this.usersRepository.findOne({
        where: { email: payload.email },
      });
      if (!user) throw new NotFoundException('User not found');

      user.passwordHash = await bcrypt.hash(newPassword, 10);
      await this.usersRepository.save(user);
      return {
        result: null,
        message: 'Password has been reset successfully.',
      };
    } catch (error) {
      throw error;
    }
  }
}
