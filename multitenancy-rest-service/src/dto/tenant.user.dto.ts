import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, ValidateNested } from 'class-validator';
import { UserDetailsDto } from './user.details.dto';

export class TenantUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tenantName: string;

  @ValidateNested({ each: true })
  @Type(() => UserDetailsDto)
  userDetails: UserDetailsDto;
}
