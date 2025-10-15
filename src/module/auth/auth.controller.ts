import {
  Controller,
  Post,
  Headers,
  Body,
  HttpStatus,
  Res,
  UseGuards,
  HttpCode,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/request-auth.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { ApiDefaultResponses } from '@common/decorators/swagger-response.decorator';
import { ResponseDefaultDto } from '@common/dto/response-default.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiDefaultResponses('Success login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { result } = await this.authService.login(loginDto);

    res.cookie('token', result.token, {
      httpOnly: false,
      secure: false, // aktifkan di production
      sameSite: 'strict',
      maxAge: 2 * 60 * 60 * 1000, // 2 jam
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: false,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    });
    return new ResponseDefaultDto({
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      result: {
        user: result.user,
        token: result.token,
      },
    });
  }

  @Post('register')
  @ApiDefaultResponses('Success register')
  @ApiResponse({ status: 401, description: 'Failed credentials' })
  async register(@Body() registerDto: RegisterDto) {
    const resp = await this.authService.register(registerDto);
    return new ResponseDefaultDto(resp);
  }

  @Post('refresh-token')
  @ApiDefaultResponses('Success refresh token')
  @ApiResponse({ status: 401, description: 'Failed credentials' })
  async refreshToken(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Ambil refresh token dari cookie
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'No refresh token provided' });
    }

    const { result } = await this.authService.refreshToken(refreshToken);

    res.cookie('token', result.token, {
      httpOnly: false,
      secure: false, // aktifkan di production
      sameSite: 'none',
      maxAge: 2 * 60 * 60 * 1000, // 2 jam
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: false,
      secure: false,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    });

    return { message: 'Token refreshed successfully' };
  }

  @Post('forgot-password')
  @ApiDefaultResponses('Success')
  @ApiResponse({ status: 401, description: 'Failed credentials' })
  async forgotPassword(@Res() res: any, @Body() dto: ForgotPasswordDto) {
    const resp = await this.authService.forgotPassword(dto.email);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: resp?.message,
    });
  }

  @Post('reset-password')
  @ApiDefaultResponses('Success reset password')
  @ApiResponse({ status: 401, description: 'Failed credentials' })
  @UseGuards(JwtAuthGuard)
  async resetPassword(
    @Headers('authorization') authHeader: string,
    @Body() dto: ResetPasswordDto,
  ) {
    const token = authHeader?.split(' ')[1];
    const resp = await this.authService.resetPassword(dto.password, token);
    return new ResponseDefaultDto({
      statusCode: HttpStatus.OK,
      message: resp?.message,
    });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiDefaultResponses('Success logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    return { message: 'Logout successful' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  @HttpCode(HttpStatus.OK)
  // @ApiDefaultResponses('Check login status')
  async me(@Req() req: any) {
    try {
      // JwtAuthGuard akan otomatis memvalidasi token dan inject user ke req.user
      const user = req.user;
      if (!user) {
        return { isLoggedIn: false, message: 'Not logged in' };
      }
      return { isLoggedIn: true, user };
    } catch (error) {
      return { isLoggedIn: false, message: 'Not logged in', error };
    }
  }
}
