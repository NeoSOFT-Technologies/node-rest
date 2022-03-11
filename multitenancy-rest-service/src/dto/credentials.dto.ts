import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

export class CredentialsDto {
  username: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and ' +
      'one special character'
  })
  password: string;

  tenantName: string;

  @ApiHideProperty()
  clientId: string;

  @ApiHideProperty()
  clientSecret: string
}
