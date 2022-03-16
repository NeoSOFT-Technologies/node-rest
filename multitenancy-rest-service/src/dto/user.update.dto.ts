import UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import { ApiHideProperty } from "@nestjs/swagger";

class UserDetails implements UserRepresentation {
  firstName?: string;
  lastName?: string;
  email?: string;
  enabled?: boolean;
  realmRoles?: string[];
}

export class UpdateUserDto {
  @ApiHideProperty()
  tenantName: string;

  userName: string;
  action: UserDetails;
}
