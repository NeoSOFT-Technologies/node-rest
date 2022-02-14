import { ApiProperty } from '@nestjs/swagger';
import { columnDto } from './column.dto';

export class ProvisionTenantTableDto {
  @ApiProperty()
  dbName: string;
  @ApiProperty()
  tableName: string;
  @ApiProperty()
  columns: columnDto[];
}
