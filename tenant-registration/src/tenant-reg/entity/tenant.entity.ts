import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  tenantName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  description: string;

  @Column()
  databaseName: string;

  @Column()
  databaseDescription: string;

  @Column()
  createdDateTime: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column()
  clientId: string;

  @Column()
  clientSecret: string;
}
