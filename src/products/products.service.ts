import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Product } from '../db/entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SortOptions } from '../typings/query';
import { CreateProductDto, RemoveDataDto } from '../typings/requests';

@Injectable()
export class ProductsService {
  private logger = new Logger(ProductsService.name);
  
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProducts(query?: string, sort?: SortOptions) {
    try {
      let queryBuilder = this.productRepository.createQueryBuilder('product');
      if (sort) {
        queryBuilder = queryBuilder.orderBy(`product.${sort.field}`, sort.order);
      }
      if (query) {
        queryBuilder = queryBuilder.where(`
          product.oem ILIKE :query 
          OR product.description ILIKE :query
          OR product.manufacturer ILIKE :query
          OR product.supplier ILIKE :query
          OR product.article ILIKE :query
        `, { query: `%${query}%` });
      }

      const results = await queryBuilder.getMany();
      
      return await Promise.all(results.map(async product => {
        const analogs: Product[] = (await this.productRepository.createQueryBuilder('product')
          .select('product.oem, product.article')
          .where('product.article = :article AND product.oem != :oem', { article: product.article, oem: product.oem })
          .execute())

        return {
          ...product, 
          analogs: analogs.filter(row => row.oem !== row.article).map(row => row.oem),
          original: analogs.find((row) => row.oem === row.article)?.oem
        }
      }));
    } catch (e) {
      this.logger.error('Error fetching products', e);
      throw new BadRequestException('Error fetching products', e);
    }
 }

 async createProduct(createProductDto: CreateProductDto) {
  try {    
    console.log(createProductDto)
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  } catch (e) {
    this.logger.error('Error creating product:', e);
    throw new BadRequestException(e);
  }
 }

 async removeProduct({ oem, article }: RemoveDataDto) {
  try {
    return await this.productRepository.delete({ oem, article });
  } catch (e) {
    this.logger.error('Error removing product:', e);
    throw new BadRequestException(e);
  }
 }

  async updateProduct(updateProductData: CreateProductDto) {
    try {
      const { oem, article, ...updateData } = updateProductData;
      return await this.productRepository.update({ oem, article }, updateData);
    } catch (e) {
      this.logger.error('Error updating product:', e);
      throw new BadRequestException(e);
    }
  }

  async getProductByOemAndArticle(oem: string, article: string) {
    try {
      const product = await this.productRepository.findOne({ where: { oem, article } });
      if (!product) {
        throw new BadRequestException('Product not found');
      }
      const analogs = (await this.productRepository.createQueryBuilder('product')
        .select('product.oem')
        .where('product.article = :article AND product.oem != :oem', { article, oem })
        .execute()).map((row: { product_oem: string }) => row.product_oem);
      return { ...product, analogs };
    } catch (e) {
      this.logger.error('Error fetching product by OEM and article:', e);
      throw new BadRequestException(e);
    }
  }
}
