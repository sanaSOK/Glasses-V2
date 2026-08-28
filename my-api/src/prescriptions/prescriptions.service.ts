import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prescription } from './entities/prescription.entity';
import { Customer } from '../customers/entities/customer.entity';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private prescriptionRepository: Repository<Prescription>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(dto: CreatePrescriptionDto, user: ActiveUserData) {
    const storeId = dto.store_id || user.storeId || 1;
    let customer = await this.customerRepository.findOne({
      where: { user_id: user.userId, store_id: storeId },
    });

    if (!customer) {
      try {
        customer = this.customerRepository.create({
          user_id: user.userId,
          store_id: storeId,
        });
        customer = await this.customerRepository.save(customer);
      } catch (e) {
        customer = await this.customerRepository.findOne({
          where: { user_id: user.userId, store_id: storeId },
        });
        if (!customer) throw e;
      }
    }

    const prescription = this.prescriptionRepository.create({
      ...dto,
      customer_id: customer.id,
    });

    return this.prescriptionRepository.save(prescription);
  }

  async findAll(user: ActiveUserData) {
    const customers = await this.customerRepository.find({ where: { user_id: user.userId } });
    if (customers.length === 0) {
      return [];
    }

    const customerIds = customers.map((c) => c.id);
    return this.prescriptionRepository
      .createQueryBuilder('p')
      .where('p.customer_id IN (:...customerIds)', { customerIds })
      .orderBy('p.created_at', 'DESC')
      .getMany();
  }

  async findOne(id: number) {
    const prescription = await this.prescriptionRepository.findOne({
      where: { id },
      relations: { customer: true, order: true },
    });

    if (!prescription) {
      throw new NotFoundException(`Prescription #${id} not found`);
    }

    return prescription;
  }

  async update(id: number, dto: UpdatePrescriptionDto) {
    const prescription = await this.findOne(id);
    Object.assign(prescription, dto);
    return this.prescriptionRepository.save(prescription);
  }

  async remove(id: number) {
    const prescription = await this.findOne(id);
    await this.prescriptionRepository.remove(prescription);
    return { message: `Prescription #${id} deleted` };
  }
}
