import ClientRepresentation from '@keycloak/keycloak-admin-client/lib/defs/clientRepresentation';
import protocolMapperRepresentation from '@keycloak/keycloak-admin-client/lib/defs/protocolMapperRepresentation';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

class ClientDetails implements ClientRepresentation {
  clientId?: string;
  rootUrl?: string;
  redirectUris?: string[];
  serviceAccountsEnabled?: boolean;
  authorizationServicesEnabled?: boolean;
  directAccessGrantsEnabled?: boolean;
  protocolMappers?: protocolMapperRepresentation[];
}

export class ClientDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tenantName: string;

  clientDetails?: ClientDetails;
}
