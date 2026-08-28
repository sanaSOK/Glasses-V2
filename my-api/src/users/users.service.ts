import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto, _currentUser: ActiveUserData) {
    const user = this.userRepository.create({
      ...dto,
    });

    return await this.userRepository.save(user);
  }

  async findAll(_currentUser: ActiveUserData) {
    return await this.userRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number, _currentUser: ActiveUserData) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { customer: true },
    });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return user;
  }

  async update(id: number, dto: UpdateUserDto, _currentUser: ActiveUserData) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    Object.assign(user, dto);
    return await this.userRepository.save(user);
  }

  async remove(id: number, _currentUser: ActiveUserData) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    await this.userRepository.remove(user);
    return { message: `User #${id} deleted successfully` };
  }
}
