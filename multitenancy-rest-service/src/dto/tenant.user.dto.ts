import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, ValidateNested } from 'class-validator';
import { UserDetailsDto } from './user.details.dto';

export class TenantUserDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tenantName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,{
    message: 'password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and '+
    'one special character'
  })
  password: string;

  @ValidateNested({ each: true })
  @Type(() => UserDetailsDto)
  userDetails: UserDetailsDto;
}
