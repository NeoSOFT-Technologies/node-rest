import PolicyRepresentation from '@keycloak/keycloak-admin-client/lib/defs/policyRepresentation';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

class PolicyDetails implements PolicyRepresentation {
  name?: string;
  description?: string;
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
