import { ApiProperty } from '@nestjs/swagger';

export class DeleteTenantDto {
  @ApiProperty()
  tenantName: string;
}
