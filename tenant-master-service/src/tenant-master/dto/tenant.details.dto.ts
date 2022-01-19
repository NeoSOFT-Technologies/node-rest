export class TenantDetailsDto {
  tenantId: string;
  tenantName: string;
  tenantDbName?: string;
  password: string;
  description: string;
  createdDateTime: string;
  host?: string;
  port?: number;
}
