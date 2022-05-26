import { ApiHideProperty } from "@nestjs/swagger";

export class ScopeRepresentationDto {
    name: string;

    @ApiHideProperty()
    displayName?: string;

    @ApiHideProperty()
    iconUri?: string;
    
    @ApiHideProperty()
    id?: string;
}
