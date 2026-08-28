import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private imageRepository: Repository<ProductImage>,
  ) {}

  async create(dto: CreateProductDto, currentUser?: ActiveUserData) {
    const targetStoreId =
      currentUser?.role === Role.SUPER_ADMIN ? dto.store_id : currentUser?.storeId || dto.store_id;

    const slug = dto.slug || this.slugify(dto.name);
    const { images, ...productData } = dto;

    const product = this.productRepository.create({
      ...productData,
      store_id: targetStoreId!,
      slug,
    });

    const savedProduct = await this.productRepository.save(product);

    if (images && images.length > 0) {
      const imageEntities = images.map((url, index) =>
        this.imageRepository.create({
          product_id: savedProduct.id,
          image_url: url,
          is_primary: index === 0,
        }),
      );
      await this.imageRepository.save(imageEntities);
    }

    return this.findOne(savedProduct.id);
  }

  async findAll(filter: FilterProductDto, currentUser?: ActiveUserData) {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.store', 'store')
      .leftJoinAndSelect('product.images', 'images');

    // Strict Store Isolation Enforcement
    if (currentUser && currentUser.role !== Role.SUPER_ADMIN) {
      query.andWhere('product.store_id = :storeId', { storeId: currentUser.storeId });
    } else if (filter.store_id) {
      query.andWhere('product.store_id = :storeId', { storeId: filter.store_id });
    }

    if (filter.search) {
      query.andWhere(
        '(LOWER(product.name) LIKE LOWER(:search) OR LOWER(product.brand) LIKE LOWER(:search) OR LOWER(product.description) LIKE LOWER(:search))',
        { search: `%${filter.search}%` },
      );
    }

    if (filter.category_id) {
      query.andWhere('product.category_id = :categoryId', { categoryId: filter.category_id });
    }

    if (filter.brand) {
      query.andWhere('LOWER(product.brand) = LOWER(:brand)', { brand: filter.brand });
    }

    if (filter.minPrice !== undefined) {
      query.andWhere('product.price >= :minPrice', { minPrice: filter.minPrice });
    }

    if (filter.maxPrice !== undefined) {
      query.andWhere('product.price <= :maxPrice', { maxPrice: filter.maxPrice });
    }

    if (filter.gender) {
      query.andWhere('product.gender = :gender', { gender: filter.gender });
    }

    if (filter.frame_shape) {
      query.andWhere('LOWER(product.frame_shape) = LOWER(:frame_shape)', {
        frame_shape: filter.frame_shape,
      });
    }

    const page = filter.page || 1;
    const limit = filter.limit || 20;
    const skip = (page - 1) * limit;

    const sortBy = filter.sortBy || 'created_at';
    const order = filter.order || 'DESC';

    query.orderBy(`product.${sortBy}`, order);
    query.skip(skip).take(limit);

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { category: true, store: true, images: true, reviews: { customer: true } },
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.productRepository.findOne({
      where: { slug },
      relations: { category: true, store: true, images: true, reviews: { customer: true } },
    });

    if (!product) {
      throw new NotFoundException(`Product '${slug}' not found`);
    }

    return product;
  }

  async update(id: number, dto: UpdateProductDto, currentUser?: ActiveUserData) {
    const product = await this.findOne(id);

    if (currentUser && currentUser.role !== Role.SUPER_ADMIN && product.store_id !== currentUser.storeId) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    if (dto.name && !dto.slug) {
      dto.slug = this.slugify(dto.name);
    }

    const { images, ...productData } = dto;
    Object.assign(product, productData);
    await this.productRepository.save(product);

    if (images) {
      await this.imageRepository.delete({ product_id: id });
      const imageEntities = images.map((url, index) =>
        this.imageRepository.create({
          product_id: id,
          image_url: url,
          is_primary: index === 0,
        }),
      );
      await this.imageRepository.save(imageEntities);
    }

    return this.findOne(id);
  }

  async remove(id: number, currentUser?: ActiveUserData) {
    const product = await this.findOne(id);

    if (currentUser && currentUser.role !== Role.SUPER_ADMIN && product.store_id !== currentUser.storeId) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    await this.productRepository.remove(product);
    return { message: `Product #${id} deleted successfully` };
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
