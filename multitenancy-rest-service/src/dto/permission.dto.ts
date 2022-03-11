import PolicyRepresentation from "@keycloak/keycloak-admin-client/lib/defs/policyRepresentation";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";

class PermissionDetails implements PolicyRepresentation{
    name?: string;
    description?: string;
    scopes?: string[];
    resources?: string[];
}

export class PermissionDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    tenantName: string;
    
    permissionType: string;
    clientName: string;
    permissionDetails: PermissionDetails;
}