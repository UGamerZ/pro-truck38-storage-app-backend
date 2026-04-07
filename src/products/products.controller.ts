import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, RemoveDataDto } from '../typings/requests';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller("/products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProducts(@Query("query") query: string, @Query("sortField") sort: string, @Query("sortOrder") order: 'ASC' | 'DESC') {
    return this.productsService.getProducts(query, sort ? { field: sort, order } : undefined);
  }

  @Get("/:oem/:article")
  getProductByOemAndArticle(@Param("oem") oem: string, @Param("article") article: string) {
    return this.productsService.getProductByOemAndArticle(oem, article);
  }

  @Post("/create")
  @UseInterceptors(FilesInterceptor('photos'))
  createProduct(@UploadedFiles() photos: Express.Multer.File[], @Body() createProductData: CreateProductDto) {
    return this.productsService.createProduct(createProductData, photos);
  }

  @Post("/update")
  @UseInterceptors(FilesInterceptor('photos'))
  updateProduct(@UploadedFiles() photos: Express.Multer.File[], @Body() updateProductData: CreateProductDto) {
    return this.productsService.updateProduct(updateProductData, photos);
  }

  @Get("/logs")
  getProductsLogs(@Query("query") query: string, @Query("sortField") sort: string, @Query("sortOrder") order: 'ASC' | 'DESC') {
    return this.productsService.getProductsLogs(query, sort ? { field: sort, order } : undefined);
  }

  @Get("logs/:oem/:article")
  getProductLogsByOemAndArticle(@Param("oem") oem: string, @Param("article") article: string) {
    return this.productsService.getProductLogsByOemAndArticle(oem, article);
  }

  @Delete("/remove")
  removeProduct(@Body() removeData: RemoveDataDto){
    return this.productsService.removeProduct(removeData)
  }
}
