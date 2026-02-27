import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, RemoveDataDto } from '../typings/requests';

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
  createProduct(@Body() createProductData: CreateProductDto) {
    return this.productsService.createProduct(createProductData);
  }

  @Post("/update")
  updateProduct(@Body() updateProductData: CreateProductDto) {
    return this.productsService.updateProduct(updateProductData);
  }

  @Delete("/remove")
  removeProduct(@Body() removeData: RemoveDataDto){
    return this.productsService.removeProduct(removeData)
  }
}
