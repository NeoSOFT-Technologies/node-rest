import { ApiProperty } from '@nestjs/swagger';

export class RegisterTenantDto {
  tenantName?: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  description: string;
  createdDateTime?: string;
}
