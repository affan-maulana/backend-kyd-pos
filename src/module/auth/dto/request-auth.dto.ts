import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginBaseDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'dendyF@gmail.com' })
  email: string; // required

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @ApiProperty({ example: '*****' })
  password: string; // required
}

export class LoginDto extends LoginBaseDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '9a1a26fa-a4f1-4d91-85be-793653c27941' })
  businessTypeId: string; // required
}

export class RegisterDto extends LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Dendy F' })
  name: string; // required

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '0812999999' })
  phone: string; // required

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Toko Bangunan' })
  businessName: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'example@mail.com' })
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: '*****' })
  password: string;
}
