import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const checkTokens = request.headers.authorization;

    if (!checkTokens) {
      throw new UnauthorizedException('Authorization token not found');
    }

    const token = checkTokens.startsWith('Bearer ')
      ? checkTokens.split(' ')[1]
      : null;

    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      if (payload.exp && Date.now() >= payload.exp * 1000) {
        throw new UnauthorizedException('Token has expired');
      }

      const user = await this.authService.getUser(payload.id);

      if (!user) {
        throw new UnauthorizedException(`User with id ${payload.id} not found`);
      }

      if (payload.code) {
        request['code'] = payload.code;
      }

      request['user'] = user;
    } catch (error) {
      console.error('JWT verification failed:', error);
      throw new UnauthorizedException(error.message || 'Unauthorized');
    }

    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies['token'];
  }
}
