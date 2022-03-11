import { ApiHideProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { UserDetailsDto } from './user.details.dto';

export class TenantUserDto {
  @ApiHideProperty()
  tenantName: string;

  @ValidateNested({ each: true })
  @Type(() => UserDetailsDto)
  userDetails: UserDetailsDto;
}
