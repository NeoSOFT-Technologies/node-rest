import { ApiProperty } from "@nestjs/swagger";

export class columnDto {
  @ApiProperty()
  columnName: string;
  @ApiProperty()
  columntype: any;
}
