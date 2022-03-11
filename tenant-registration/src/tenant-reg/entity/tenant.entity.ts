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
  createdDateTime: string;

  @Column({ default: false })
  isDelete: boolean;

  @Column()
  clientId: string;

  @Column()
  clientSecret: string;
}
