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
import { User } from '../users/entities/user.entity';
import { Customer } from '../customers/entities/customer.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../common/enums/role.enum';
import { Store } from '../stores/entities/store.entity';

function sanitizeAddress(inputAddress?: string): string | null {
  if (!inputAddress || !inputAddress.trim()) return null;
  const addr = inputAddress.trim();

  // If user inputs a Google Maps link or URL
  if (addr.includes('google.com/maps') || addr.includes('maps.app.goo.gl') || addr.startsWith('http')) {
    try {
      const match = addr.match(/\/maps\/(?:dir\/[^\/]*\/|place\/)([^\/@\?]+)/i) || addr.match(/\?q=([^&]+)/i);
      if (match && match[1]) {
        return `https://maps.google.com/?q=${match[1]}`;
      }
      if (addr.includes('maps.app.goo.gl')) {
        return addr;
      }
      const cleanUrl = addr.split('?')[0].split('/data=')[0];
      return cleanUrl;
    } catch {
      return addr;
    }
  }

  // Convert plain text address to direct short Google Maps link
  return `https://maps.google.com/?q=${encodeURIComponent(addr)}`;
}

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
    const identifier = (dto.usernameOrPhone || dto.name || dto.phone || 'user').trim();

    const existingUser = await this.userRepository.findOne({
      where: [
        { store_name: identifier },
        { phone: identifier }
      ],
    });
    if (existingUser) {
      throw new ConflictException('An account with this username or phone already exists');
    }

    const cleanAddress = sanitizeAddress(dto.address);

    let createdStore: Store | null = null;
    if (dto.storeName && dto.storeName.trim()) {
      const slug = dto.storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      createdStore = this.storeRepository.create({
        name: dto.storeName.trim(),
        slug: `${slug}-${Date.now()}`,
        address: cleanAddress || undefined,
        phone: identifier,
      });
      createdStore = await this.storeRepository.save(createdStore);
    }

    const storeNameVal = createdStore ? createdStore.name : identifier;

    const user: User = this.userRepository.create({
      store_name: storeNameVal,
      phone: identifier,
      address: cleanAddress,
      role: createdStore ? Role.STORE_ADMIN : (dto.role || Role.CUSTOMER),
    });

    const savedUser: User = await this.userRepository.save(user);

    if (savedUser.role === Role.CUSTOMER && createdStore) {
      const customer = this.customerRepository.create({
        user_id: savedUser.id,
        store_id: createdStore.id,
        address: cleanAddress || undefined,
      });
      await this.customerRepository.save(customer);
    }

    const tokens = await this.generateTokens(savedUser);

    return {
      message: 'Registration successful',
      user: {
        id: savedUser.id,
        name: savedUser.store_name,
        store_name: savedUser.store_name,
        address: savedUser.address,
        role: savedUser.role,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const identifier = (dto.usernameOrPhone || dto.email || '').trim();
    const user = await this.userRepository.findOne({
      where: [
        { store_name: identifier },
        { phone: identifier }
      ],
    });

    if (!user) {
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
        name: user.store_name,
        store_name: user.store_name,
        address: user.address,
        role: user.role,
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
      relations: { customer: true },
    });
    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    return user;
  }

  private async generateTokens(user: User) {
    const payload = {
      userId: user.id,
      store_name: user.store_name,
      role: user.role,
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
