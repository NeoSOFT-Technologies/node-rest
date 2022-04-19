export class RegisterTenantDto {
  tenantName: string;
  email: string;
  password: string;
  description: string;
  databaseName: string;
  databaseDescription: string;
  createdDateTime?: string;
  clientId: string;
  clientSecret: string;
}
