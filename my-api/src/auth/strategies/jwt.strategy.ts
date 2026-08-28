import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { ActiveUserData } from '../../common/interfaces/active-user-data.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'defaultSecret',
    });
  }

  async validate(payload: any): Promise<ActiveUserData> {
    if (!payload || !payload.userId) {
      throw new UnauthorizedException('Invalid JWT token payload');
    }
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      storeId: payload.storeId ?? null,
    };
  }
}
