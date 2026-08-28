import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  async create(dto: CreateStoreDto) {
    const slug = dto.slug || this.slugify(dto.name);
    const existing = await this.storeRepository.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException('Store with this name or slug already exists');
    }

    const store = this.storeRepository.create({
      ...dto,
      slug,
    });
    return this.storeRepository.save(store);
  }

  async findAll() {
    return this.storeRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    const store = await this.storeRepository.findOne({
      where: { id },
      relations: { categories: true, promotions: true },
    });
    if (!store) {
      throw new NotFoundException(`Store #${id} not found`);
    }
    return store;
  }

  async findBySlug(slug: string) {
    const store = await this.storeRepository.findOne({
      where: { slug },
      relations: { categories: true, promotions: true },
    });
    if (!store) {
      throw new NotFoundException(`Store with slug '${slug}' not found`);
    }
    return store;
  }

  async update(id: number, dto: UpdateStoreDto) {
    const store = await this.findOne(id);
    if (dto.slug && dto.slug !== store.slug) {
      const existing = await this.storeRepository.findOne({ where: { slug: dto.slug } });
      if (existing) {
        throw new ConflictException(`Slug '${dto.slug}' is already taken`);
      }
    }
    Object.assign(store, dto);
    return this.storeRepository.save(store);
  }

  async remove(id: number) {
    const store = await this.findOne(id);
    await this.storeRepository.remove(store);
    return { message: `Store #${id} deleted successfully` };
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
