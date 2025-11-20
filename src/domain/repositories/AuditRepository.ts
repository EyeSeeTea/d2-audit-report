import { FutureData } from "$/data/api-futures";
import { DataValueAudit } from "$/domain/entities/DataValueAudit";
import { PaginatedResponse } from "$/domain/entities/PaginatedResponse";
import { AuditsFilters } from "$/domain/usecases/GetAuditsUseCase";
export interface AuditRepository {
    getAll(filters: AuditsFilters): FutureData<PaginatedResponse<DataValueAudit>>;
}
