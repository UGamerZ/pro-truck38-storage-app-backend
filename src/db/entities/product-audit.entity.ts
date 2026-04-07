import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('products_audit')
export class ProductAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  oem: string;

  @Column()
  article: string;

  @CreateDateColumn({ name: "changed_at" })
  changedAt: Date;

  @Column('jsonb')
  changes: Record<string, { old: any; new: any }>;
}
