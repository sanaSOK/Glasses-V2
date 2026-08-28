import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Customer } from '../customers/entities/customer.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      password: hashedPassword,
      phone: dto.phone,
      store_id: dto.store_id || null,
      role: dto.role || Role.CUSTOMER,
    });

    const savedUser = await this.userRepository.save(user);

    // If registered user is CUSTOMER and store_id provided, create Customer record
    if (savedUser.role === Role.CUSTOMER && savedUser.store_id) {
      const customer = this.customerRepository.create({
        user_id: savedUser.id,
        store_id: savedUser.store_id,
      });
      await this.customerRepository.save(customer);
    }

    const tokens = await this.generateTokens(savedUser);

    return {
      message: 'Registration successful',
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        storeId: savedUser.store_id,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Your account is inactive. Please contact support.');
    }

    const tokens = await this.generateTokens(user);

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        storeId: user.store_id,
      },
      ...tokens,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const refreshSecret =
        this.configService.get<string>('REFRESH_TOKEN_SECRET') || 'defaultRefreshSecret';
      const payload = this.jwtService.verify(refreshToken, { secret: refreshSecret });

      const user = await this.userRepository.findOne({ where: { id: payload.userId } });
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { store: true, customer: true },
    });
    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    const { password, ...result } = user;
    return result;
  }

  private async generateTokens(user: User) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      storeId: user.store_id,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshSecret =
      this.configService.get<string>('REFRESH_TOKEN_SECRET') || 'defaultRefreshSecret';
    const refreshTokenExpires =
      this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '30d';

    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshTokenExpires as any,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
