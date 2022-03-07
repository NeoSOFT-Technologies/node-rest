import UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";

class UserDetails implements UserRepresentation {
  firstName?: string;
  lastName?: string;
  email?: string;
  enabled?: boolean;
}

export class UpdateUserDto {
  tenantName: string;
  userName: string;
  action: UserDetails;
}
