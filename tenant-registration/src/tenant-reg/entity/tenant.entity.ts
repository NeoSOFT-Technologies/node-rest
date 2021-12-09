import { Column, Entity, ObjectIdColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn()
  // @ObjectIdColumn()
  id: string;

  @Column()
  tenantName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  description:string

  @Column()
  createdDateTime:string
}
