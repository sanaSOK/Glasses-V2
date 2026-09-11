import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  private async resequenceUserIds() {
    try {
      const queryRunner = this.userRepository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');
        
        // 1. Fetch remaining users ordered by id ASC
        const users = await queryRunner.query('SELECT id FROM users ORDER BY id ASC');
        
        // 2. Re-assign sequential IDs starting from 1 in MySQL database
        for (let i = 0; i < users.length; i++) {
          const newId = i + 1;
          const oldId = users[i].id;
          if (oldId !== newId) {
            await queryRunner.query('UPDATE users SET id = ? WHERE id = ?', [newId, oldId]);
            await queryRunner.query('UPDATE customers SET user_id = ? WHERE user_id = ?', [newId, oldId]);
          }
        }
        
        // 3. Reset AUTO_INCREMENT in MySQL database
        const nextAutoIncrement = users.length + 1;
        await queryRunner.query(`ALTER TABLE users AUTO_INCREMENT = ${nextAutoIncrement}`);
        
        await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');
        await queryRunner.commitTransaction();
      } catch (err) {
        await queryRunner.rollbackTransaction();
        console.error('Failed to resequence user IDs:', err);
      } finally {
        await queryRunner.release();
      }
    } catch (err) {
      console.error('Resequence error:', err);
    }
  }

  async create(dto: CreateUserDto, currentUser: ActiveUserData) {
    // Only Super Admin can assign or create Store Admin / Super Admin roles
    if (currentUser.role !== Role.SUPER_ADMIN) {
      if (dto.role === Role.SUPER_ADMIN) {
        throw new ForbiddenException('Only Super Admin can create another Super Admin');
      }
      if (dto.role === Role.STORE_ADMIN) {
        throw new ForbiddenException('Only Super Admin can create or assign Store Admins');
      }
    }

    const user = this.userRepository.create({
      ...dto,
      role: dto.role || Role.STAFF,
      status: 'ACTIVE',
    });

    const saved = await this.userRepository.save(user);
    await this.resequenceUserIds();
    return saved;
  }

  async findAll(currentUser: ActiveUserData) {
    // Re-sequence MySQL database IDs so database IDs are 1, 2, 3, 4 sequentially
    await this.resequenceUserIds();

    // Super Admin gets all users and store admins across all stores
    if (currentUser.role === Role.SUPER_ADMIN) {
      return await this.userRepository.find({
        order: { id: 'ASC' },
      });
    }

    // Other admins get users list
    return await this.userRepository.find({
      order: { id: 'ASC' },
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

  async update(id: number, dto: UpdateUserDto, currentUser: ActiveUserData) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    // Protection: Only Super Admin can manage/update a Store Admin or Super Admin account
    if (
      (user.role === Role.SUPER_ADMIN || user.role === Role.STORE_ADMIN) &&
      currentUser.role !== Role.SUPER_ADMIN
    ) {
      throw new ForbiddenException('Only Super Admin has authority to manage Admin accounts');
    }

    // Only Super Admin can alter user roles
    if (dto.role && dto.role !== user.role && currentUser.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('Only Super Admin can elevate or change user roles');
    }

    Object.assign(user, dto);
    const updated = await this.userRepository.save(user);
    await this.resequenceUserIds();
    return updated;
  }

  async remove(id: number, currentUser: ActiveUserData) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    // Protection: Only Super Admin can delete admin accounts
    if (
      (user.role === Role.SUPER_ADMIN || user.role === Role.STORE_ADMIN) &&
      currentUser.role !== Role.SUPER_ADMIN
    ) {
      throw new ForbiddenException('Only Super Admin can delete Store Admin or Super Admin accounts');
    }

    if (user.id === currentUser.userId) {
      throw new BadRequestException('You cannot delete your own active admin account');
    }

    await this.userRepository.remove(user);

    // Re-sequence MySQL database IDs so database IDs are 1, 2, 3, 4 sequentially after deletion
    await this.resequenceUserIds();

    return { message: `User #${id} deleted and database IDs resequenced successfully` };
  }
}
