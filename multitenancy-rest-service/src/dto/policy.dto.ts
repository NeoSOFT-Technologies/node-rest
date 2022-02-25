import PolicyRepresentation from '@keycloak/keycloak-admin-client/lib/defs/policyRepresentation';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class PolicyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tenantName: string;


  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and ' +
      'one special character'
  })
  password: string;

  policyType:string
  clientName:string
  policyDetails: PolicyRepresentation
}