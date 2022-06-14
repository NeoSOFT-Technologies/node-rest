import PolicyRepresentation from "@keycloak/keycloak-admin-client/lib/defs/policyRepresentation";

class PermissionDetails implements PolicyRepresentation {
    name?: string;
    description?: string;
    scopes?: string[];
    resources?: string[];
}

export class UpdatePermissionDto {
    tenantName: string;
    clientName: string;
    permissionName: string;
    permissionType: string;
    permissionDetails: PermissionDetails;
}
