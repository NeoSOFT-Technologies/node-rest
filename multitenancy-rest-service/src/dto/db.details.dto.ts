import { ApiProperty } from '@nestjs/swagger';

export class DbDetailsDto {
  @ApiProperty()
  host: string;
  @ApiProperty()
  port: number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  dbName: string;
}
