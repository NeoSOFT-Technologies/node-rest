import { columnDto } from "./column.dto";

export class ProvisionTenantTableDto {
    dbName:string;
    tableName: string;
    columns: columnDto[];
}
