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

import { Store } from '../stores/entities/store.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const inputVal = (dto.usernameOrPhone || dto.email || dto.name || 'user').trim();
    const isEmail = inputVal.includes('@');
    const isPhone = /^[0-9+()\s-]+$/.test(inputVal) && inputVal.length >= 7;

    const email = isEmail
      ? inputVal.toLowerCase()
      : (dto.email ? dto.email.toLowerCase() : `${inputVal.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}@glasses.local`);
    
    const phone = isPhone
      ? inputVal
      : (dto.phone || undefined);
    
    const name = dto.name || inputVal;

    const existingUser = await this.userRepository.findOne({
      where: [
        { email: email.toLowerCase() },
        ...(phone ? [{ phone }] : [])
      ],
    });
    if (existingUser) {
      throw new ConflictException('An account with this username, phone, or email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    let createdStore: Store | null = null;
    if (dto.storeName && dto.storeName.trim()) {
      const slug = dto.storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      createdStore = this.storeRepository.create({
        name: dto.storeName.trim(),
        slug: `${slug}-${Date.now()}`,
        address: dto.address || undefined,
        phone: phone || undefined,
      });
      createdStore = await this.storeRepository.save(createdStore);
    }

    const user = this.userRepository.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || null,
      store_id: createdStore ? createdStore.id : (dto.store_id || null),
      role: createdStore ? Role.STORE_ADMIN : (dto.role || Role.CUSTOMER),
    });

    const savedUser = await this.userRepository.save(user);

    if (savedUser.role === Role.CUSTOMER && savedUser.store_id) {
      const customer = this.customerRepository.create({
        user_id: savedUser.id,
        store_id: savedUser.store_id,
        address: dto.address || undefined,
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
    const identifier = (dto.email || '').toLowerCase().trim();
    const user = await this.userRepository.findOne({
      where: [
        { email: identifier },
        { phone: identifier },
        { name: identifier }
      ],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
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
