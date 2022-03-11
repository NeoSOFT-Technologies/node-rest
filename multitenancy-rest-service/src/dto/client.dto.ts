import ClientRepresentation from '@keycloak/keycloak-admin-client/lib/defs/clientRepresentation';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

class ClientDetails implements ClientRepresentation {
  clientId?: string;
  rootUrl?: string;
  redirectUris?: string[];
  serviceAccountsEnabled?: boolean;
  authorizationServicesEnabled?: boolean;
  directAccessGrantsEnabled?: boolean;
}

export class ClientDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tenantName: string;

  clientDetails: ClientDetails;
}
