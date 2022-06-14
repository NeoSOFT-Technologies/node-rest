import { ApiHideProperty } from "@nestjs/swagger"

export class GetUsersInfoDto {
  tenantName?: string
  userName?: string

  @ApiHideProperty()
  clientName?: string
}
