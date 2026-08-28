import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async findAll(currentUser: ActiveUserData) {
    const where: any = {};
    if (currentUser.role !== Role.SUPER_ADMIN) {
      where.store_id = currentUser.storeId;
    }
    return this.customerRepository.find({
      where,
      relations: { user: true, store: true, orders: true, prescriptions: true },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number, currentUser: ActiveUserData) {
    const where: any = { id };
    if (currentUser.role !== Role.SUPER_ADMIN && currentUser.role !== Role.CUSTOMER) {
      where.store_id = currentUser.storeId;
    }

    const customer = await this.customerRepository.findOne({
      where,
      relations: { user: true, store: true, orders: true, prescriptions: true, favorites: { product: true } },
    });

    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }

    return customer;
  }

  async findByUserId(userId: number) {
    const customer = await this.customerRepository.findOne({
      where: { user_id: userId },
      relations: { user: true, store: true, prescriptions: true },
    });
    if (!customer) {
      throw new NotFoundException(`Customer profile for user #${userId} not found`);
    }
    return customer;
  }
}
