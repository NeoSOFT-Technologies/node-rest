import { ScopeRepresentationDto } from "./scope.representation.dto";

export class ScopeDto{
    tenantName: string;
    password: string;
    clientName:string;
    scopeDetails: ScopeRepresentationDto;
}