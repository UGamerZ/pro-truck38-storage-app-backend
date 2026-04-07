import { Entity, Column, PrimaryColumn, UpdateDateColumn } from 'typeorm';

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
  
  @UpdateDateColumn()
  lastUpdateDate: Date;

  @Column({ array: true, type: "varchar" })
  photos: string[];

  @Column()
  cellNumber: number;

  @Column({ nullable: true })
  qrCode?: string;
}
