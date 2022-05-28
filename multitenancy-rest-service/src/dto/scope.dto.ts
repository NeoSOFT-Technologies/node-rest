import { ScopeRepresentationDto } from "./scope.representation.dto";

export class ScopeDto {
    tenantName: string;
    clientName: string;
    scopeDetails: ScopeRepresentationDto;
}
