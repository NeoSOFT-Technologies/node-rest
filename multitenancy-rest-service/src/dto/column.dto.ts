import { ApiProperty } from "@nestjs/swagger";

export class ColumnDto {
  @ApiProperty()
  columnName: string;
  @ApiProperty()
  columntype: any;
}
