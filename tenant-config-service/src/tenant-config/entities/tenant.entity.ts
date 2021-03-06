import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TenantConfig {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  tenantId: number;

  @Column()
  tenantName: string;

  @Column()
  description: string;

  @Column()
  createdDateTime: string;

  @Column()
  databaseName: string;

  @Column()
  host: string;

  @Column()
  port: number;

  @Column({ default: '{ max_size: 30 }' })
  policy: string;
}
