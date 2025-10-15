import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    // Ambil token dari cookie dan set ke authorization header
    const token = request.cookies?.token;

    if (token) {
      request.headers.authorization = `Bearer ${token}`;
    }
    return request;
  }
}