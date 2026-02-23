import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("products")
  getProducts(@Query("query") query: string, @Query("sortField") sort: string, @Query("sortOrder") order: 'ASC' | 'DESC') {
    return this.appService.getProducts(query, sort ? { field: sort, order } : undefined);
  }
}
