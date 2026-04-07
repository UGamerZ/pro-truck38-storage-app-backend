import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Product } from '../db/entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SortOptions } from '../typings/query';
import { CreateProductDto, RemoveDataDto } from '../typings/requests';
import { FileService } from '../files/file.service';
import { ProductAudit } from 'src/db/entities/product-audit.entity';

@Injectable()
export class ProductsService {
  private logger = new Logger(ProductsService.name);
  
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductAudit)
    private readonly logsRepository: Repository<ProductAudit>,
    private readonly fileService: FileService
  ) {}

  async getProducts(query?: string, sort?: SortOptions) {
    try {
      let queryBuilder = this.productRepository.createQueryBuilder('product');
      if (sort) {
        queryBuilder = queryBuilder.orderBy(`product.${sort.field}`, sort.order);
      }
      if (query) {
        queryBuilder = queryBuilder.where(`
          product.oem ILIKE :query COLLATE "ru_RU"
          OR product.description ILIKE :query COLLATE "ru_RU"
          OR product.manufacturer ILIKE :query COLLATE "ru_RU"
          OR product.supplier ILIKE :query COLLATE "ru_RU"
          OR product.article ILIKE :query COLLATE "ru_RU"
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

 async createProduct(createProductDto: CreateProductDto, files: Express.Multer.File[]) {
  try {    
    const photos = await this.fileService.uploadToGoogleDrive(files);
    const product = this.productRepository.create({ ...createProductDto, photos });
    return await this.productRepository.save(product);
  } catch (e) {
    this.logger.error('Error creating product:', e);
    throw new BadRequestException(e);
  }
 }

 async removeProduct({ oem, article }: RemoveDataDto) {
  try {
    const currPhotos = (await this.productRepository.findOne({ where: { oem, article }, select: { photos: true } })).photos;
    if (currPhotos && currPhotos.length) 
      currPhotos.forEach(photo => this.fileService.deleteFile(photo.split("/image/")[1]));
    return await this.productRepository.delete({ oem, article });
  } catch (e) {
    this.logger.error('Error removing product:', e);
    throw new BadRequestException(e);
  }
 }

  async updateProduct(updateProductData: CreateProductDto, files: Express.Multer.File[]) {
    try {
      let photos = await this.fileService.uploadToGoogleDrive(files);
      const { oem, article, ...updateData } = updateProductData;
      if (!photos.length) photos = undefined;
      else {
        const currPhotos = (await this.productRepository.findOne({ where: { oem, article }, select: { photos: true } })).photos;
        if (currPhotos && currPhotos.length) 
          currPhotos.forEach(photo => this.fileService.deleteFile(photo.split("/image/")[1]));
      }
      return await this.productRepository.update({ oem, article }, { ...updateData, photos });
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

  async getProductsLogs(query?: string, sort?: SortOptions) {
    try {
      let queryBuilder = this.logsRepository.createQueryBuilder('log').orderBy("log.id", "DESC");
      if (sort) {
        queryBuilder = queryBuilder.orderBy(`log.${sort.field}`, sort.order);
      }
      if (query) {
        queryBuilder = queryBuilder.where(`
          log.oem ILIKE :query COLLATE "ru_RU"
          OR log.article ILIKE :query COLLATE "ru_RU"
        `, { query: `%${query}%` });
      }

      return queryBuilder.getMany();
    } catch (e) {
      this.logger.error('Error fetching products', e);
      throw new BadRequestException('Error fetching products', e);
    }
  }

  async getProductLogsByOemAndArticle(oem: string, article: string) {
    try {
      return await this.logsRepository.find({ where: { oem, article } });
    } catch (e) {
      this.logger.error('Error fetching logs by OEM and article:', e);
      throw new BadRequestException(e);
    }
  }
}
