import { FutureData } from "$/data/api-futures";
import { Audit } from "$/domain/entities/Audit";
import { PaginatedResponse } from "$/domain/entities/PaginatedResponse";
import { AuditRepository } from "$/domain/repositories/AuditRepository";

export type AuditsFilters = {
    startDate?: string;
    endDate?: string;
    page: number;
    pageSize: number;
};

export class GetAuditsUseCase {
    constructor(private auditRepository: AuditRepository) {}

    public execute(filters: AuditsFilters): FutureData<PaginatedResponse<Audit>> {
        return this.auditRepository.getAll(filters);
    }
}
