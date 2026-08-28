import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from './entities/promotion.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,
  ) {}

  async create(dto: CreatePromotionDto, user: ActiveUserData) {
    const targetStoreId = user.role === Role.SUPER_ADMIN ? dto.store_id : user.storeId;
    const promotion = this.promotionRepository.create({
      ...dto,
      store_id: targetStoreId!,
    });
    return this.promotionRepository.save(promotion);
  }

  async findAll(storeId?: number) {
    const where: any = {};
    if (storeId) {
      where.store_id = storeId;
    }
    return this.promotionRepository.find({
      where,
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    const promotion = await this.promotionRepository.findOne({ where: { id } });
    if (!promotion) {
      throw new NotFoundException(`Promotion #${id} not found`);
    }
    return promotion;
  }

  async update(id: number, dto: UpdatePromotionDto, user: ActiveUserData) {
    const promotion = await this.findOne(id);
    if (user.role !== Role.SUPER_ADMIN && promotion.store_id !== user.storeId) {
      throw new NotFoundException(`Promotion #${id} not found`);
    }

    Object.assign(promotion, dto);
    return this.promotionRepository.save(promotion);
  }

  async remove(id: number, user: ActiveUserData) {
    const promotion = await this.findOne(id);
    if (user.role !== Role.SUPER_ADMIN && promotion.store_id !== user.storeId) {
      throw new NotFoundException(`Promotion #${id} not found`);
    }

    await this.promotionRepository.remove(promotion);
    return { message: `Promotion #${id} deleted` };
  }
}
