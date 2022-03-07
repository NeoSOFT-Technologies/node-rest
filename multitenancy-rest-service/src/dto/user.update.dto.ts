import UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";

export class UpdateUserDto {
  tenantName: string;
  userName: string;
  action: UserRepresentation;
}
