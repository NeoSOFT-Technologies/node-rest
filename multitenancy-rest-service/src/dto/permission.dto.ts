import PolicyRepresentation from "@keycloak/keycloak-admin-client/lib/defs/policyRepresentation";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";

export class PermissionDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    tenantName: string;
    
    permissionType: string;
    clientName: string;
    permissionDetails: PolicyRepresentation;
}