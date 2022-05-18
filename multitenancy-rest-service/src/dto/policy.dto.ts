import PolicyRepresentation from '@keycloak/keycloak-admin-client/lib/defs/policyRepresentation';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

class PolicyDetails implements PolicyRepresentation {
  name?: string;
  description?: string;
  users?: string[];
  roles?: Record<string, any>[];
  @ApiHideProperty()
  policies?: string[];
  @ApiHideProperty()
  notBefore?:string;
  @ApiHideProperty()
  notOnOrAfter?:string
}

export class PolicyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tenantName: string;

  policyType: string
  clientName: string
  policyDetails: PolicyDetails
}
