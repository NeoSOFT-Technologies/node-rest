import { ApiProperty } from '@nestjs/swagger';

class TenantDetails {
  @ApiProperty()
  tenantName: string;
  @ApiProperty()
  description: string;
}

export class UpdateTenantDto {
  @ApiProperty()
  action: TenantDetails;
}