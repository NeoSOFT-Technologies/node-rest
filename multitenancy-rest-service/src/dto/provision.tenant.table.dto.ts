import { ApiProperty } from '@nestjs/swagger';
import { ColumnDto } from './column.dto';

export class ProvisionTenantTableDto {
  @ApiProperty()
  dbName: string;
  @ApiProperty()
  tableName: string;
  @ApiProperty()
  columns: ColumnDto[];
}
