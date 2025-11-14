import { FutureData } from "$/data/api-futures";
import { DataValueAudit } from "$/domain/entities/DataValueAudit";
import { PaginatedResponse, PaginationParams } from "$/domain/entities/PaginatedResponse";
import { AuditRepository } from "$/domain/repositories/AuditRepository";

export class GetAuditsUseCase {
    constructor(private auditRepository: AuditRepository) {}

    public execute(params: PaginationParams): FutureData<PaginatedResponse<DataValueAudit>> {
        return this.auditRepository.getAll(params);
    }
}
