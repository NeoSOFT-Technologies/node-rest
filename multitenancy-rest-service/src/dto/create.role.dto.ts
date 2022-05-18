import RoleRepresentation, { Composites } from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";

class RoleDetails implements RoleRepresentation {
    name?: string;
    description?: string;
    composite?: boolean;
    composites?: Composites;
}

export class CreateRoleDto {
    tenantName: string;
    roleDetails: RoleDetails;
}