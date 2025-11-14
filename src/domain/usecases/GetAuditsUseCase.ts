import { FutureData } from "$/data/api-futures";
import { DataValueAudit } from "$/domain/entities/DataValueAudit";
import { AuditRepository } from "$/domain/repositories/AuditRepository";

export class GetAuditsUseCase {
    constructor(private auditRepository: AuditRepository) {}

    public execute(): FutureData<DataValueAudit[]> {
        return this.auditRepository.getAll();
    }
}
