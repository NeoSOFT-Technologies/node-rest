export class RegisterTenantDto {
  tenantName: string;
  email: string;
  password: string;
  description: string;
  createdDateTime?: string;
  clientId: string;
  clientSecret: string;
}
