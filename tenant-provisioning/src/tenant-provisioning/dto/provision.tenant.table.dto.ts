import { ColumnDto } from './column.dto';

export class ProvisionTenantTableDto {
  dbName: string;
  tableName: string;
  columns: ColumnDto[];
}
