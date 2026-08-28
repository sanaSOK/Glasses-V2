import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async adjustStock(productId: number, dto: AdjustStockDto, currentUser: ActiveUserData) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product #${productId} not found`);
    }

    if (currentUser.role !== Role.SUPER_ADMIN && product.store_id !== currentUser.storeId) {
      throw new NotFoundException(`Product #${productId} not found`);
    }

    const newStock = product.stock + dto.quantity;
    if (newStock < 0) {
      throw new BadRequestException(`Cannot adjust stock below 0. Current stock is ${product.stock}`);
    }

    product.stock = newStock;
    await this.productRepository.save(product);

    return {
      message: 'Stock updated successfully',
      productId: product.id,
      name: product.name,
      previousStock: product.stock - dto.quantity,
      currentStock: product.stock,
      status: product.stock > 5 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock',
    };
  }

  async getLowStock(threshold: number = 5, currentUser: ActiveUserData) {
    const whereCondition: any = { stock: LessThanOrEqual(threshold) };
    if (currentUser.role !== Role.SUPER_ADMIN) {
      whereCondition.store_id = currentUser.storeId;
    }

    return this.productRepository.find({
      where: whereCondition,
      relations: { category: true, store: true },
      order: { stock: 'ASC' },
    });
  }
}
