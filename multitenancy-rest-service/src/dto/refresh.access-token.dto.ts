import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshAccessTokenDto {
  @ApiHideProperty()
  tenantName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsJWT()
  refreshToken: string;

  @ApiHideProperty()
  clientId: string;

  @ApiHideProperty()
  clientSecret: string
}
