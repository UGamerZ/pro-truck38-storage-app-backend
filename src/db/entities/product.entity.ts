import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({name: "products"})
export class Product {
  @PrimaryColumn()
  oem: string;

  @PrimaryColumn()
  article: string;

  @Column()
  manufacturer: string;

  @Column()
  description: string;

  @Column()
  supplier: string;

  @Column()
  quantity: number;

  @Column()
  entryPrice: number;

  @Column()
  entryDate: Date;
  
  @Column()
  lastUpdateDate: Date;

  @Column({ array: true, type: "varchar" })
  photos: string[];
}
