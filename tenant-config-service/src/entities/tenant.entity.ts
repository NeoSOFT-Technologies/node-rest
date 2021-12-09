import { Column, Entity, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TenantConfig{
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
    tenantDbName: string;

    @Column()
    host: string;

    @Column()
    port: number;
}