import { ApiHideProperty } from "@nestjs/swagger"

export class UsersQueryDto {
  @ApiHideProperty()
  tenantName?: string

  page?: number
}