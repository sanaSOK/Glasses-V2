import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto, currentUser: ActiveUserData) {
    const existing = await this.userRepository.findOne({ where: { email: dto.email.toLowerCase() } });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    // Scoping for STORE_ADMIN: can only create users for their store
    let targetStoreId = dto.store_id;
    if (currentUser.role === Role.STORE_ADMIN) {
      targetStoreId = currentUser.storeId!;
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      ...dto,
      email: dto.email.toLowerCase(),
      password: hashedPassword,
      store_id: targetStoreId,
    });

    const saved = await this.userRepository.save(user);
    const { password, ...result } = saved;
    return result;
  }

  async findAll(currentUser: ActiveUserData) {
    const whereCondition: any = {};

    // Multi-tenant scope
    if (currentUser.role !== Role.SUPER_ADMIN) {
      whereCondition.store_id = currentUser.storeId;
    }

    const users = await this.userRepository.find({
      where: whereCondition,
      relations: { store: true },
      order: { created_at: 'DESC' },
    });

    return users.map(({ password, ...u }) => u);
  }

  async findOne(id: number, currentUser: ActiveUserData) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { store: true, customer: true },
    });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    if (currentUser.role !== Role.SUPER_ADMIN && user.store_id !== currentUser.storeId) {
      throw new NotFoundException(`User #${id} not found`);
    }

    const { password, ...result } = user;
    return result;
  }

  async update(id: number, dto: UpdateUserDto, currentUser: ActiveUserData) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    if (currentUser.role !== Role.SUPER_ADMIN && user.store_id !== currentUser.storeId) {
      throw new NotFoundException(`User #${id} not found`);
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);
    const updated = await this.userRepository.save(user);
    const { password, ...result } = updated;
    return result;
  }

  async remove(id: number, currentUser: ActiveUserData) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    if (currentUser.role !== Role.SUPER_ADMIN && user.store_id !== currentUser.storeId) {
      throw new NotFoundException(`User #${id} not found`);
    }

    await this.userRepository.remove(user);
    return { message: `User #${id} deleted successfully` };
  }
}
