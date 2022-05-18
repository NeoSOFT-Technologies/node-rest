import { ApiHideProperty } from "@nestjs/swagger";

export class DeleteUserDto {
  @ApiHideProperty()
  tenantName: string;

  userName: string;
}
