import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto, currentUser?: ActiveUserData) {
    const targetStoreId = currentUser?.role === Role.SUPER_ADMIN ? dto.store_id : currentUser?.storeId || dto.store_id;
    const slug = dto.slug || this.slugify(dto.name);

    const category = this.categoryRepository.create({
      ...dto,
      store_id: targetStoreId!,
      slug,
    });
    return this.categoryRepository.save(category);
  }

  async findAll(storeId?: number) {
    const where: any = {};
    if (storeId) {
      where.store_id = storeId;
    }
    return this.categoryRepository.find({
      where,
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number, storeId?: number) {
    const where: any = { id };
    if (storeId) {
      where.store_id = storeId;
    }
    const category = await this.categoryRepository.findOne({ where });
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto, currentUser?: ActiveUserData) {
    const storeId = currentUser?.role === Role.SUPER_ADMIN ? undefined : (currentUser?.storeId ?? undefined);
    const category = await this.findOne(id, storeId);

    if (dto.name && !dto.slug) {
      dto.slug = this.slugify(dto.name);
    }
    Object.assign(category, dto);
    return this.categoryRepository.save(category);
  }

  async remove(id: number, currentUser?: ActiveUserData) {
    const storeId = currentUser?.role === Role.SUPER_ADMIN ? undefined : (currentUser?.storeId ?? undefined);
    const category = await this.findOne(id, storeId);
    await this.categoryRepository.remove(category);
    return { message: `Category #${id} deleted successfully` };
  }

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }
}
