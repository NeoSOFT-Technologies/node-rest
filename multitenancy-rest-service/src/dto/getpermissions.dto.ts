import { ApiHideProperty } from "@nestjs/swagger"

export class GetPermissionsDto {
  tenantName?: string

  @ApiHideProperty()
  clientName: string
}