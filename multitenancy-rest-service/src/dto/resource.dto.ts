import ResourceRepresentation from '@keycloak/keycloak-admin-client/lib/defs/resourceRepresentation';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

class ResourceDetails implements ResourceRepresentation {
  name?: string;
  uris?: string[];
}

export class ResourceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tenantName: string;

  clientName: string;
  resourceDetails: ResourceDetails
}
