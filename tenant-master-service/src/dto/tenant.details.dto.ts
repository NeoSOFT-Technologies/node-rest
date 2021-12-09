export class TenantDetailsDto{
    tenantId: string;
    tenantName: string;
    tenantDbName?: string;
    description: string;
    createdDateTime: string;
    host?: string;
    port?: number;
}