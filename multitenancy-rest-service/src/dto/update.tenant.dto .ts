import { ApiProperty } from '@nestjs/swagger';

export class UpdateTenantDto {
  @ApiProperty()
  tenantName: string;
  @ApiProperty()
  description: string;
}
