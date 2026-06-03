import { FutureData } from "$/data/api-futures";
import { Audit } from "$/domain/entities/Audit";
import { PaginatedResponse } from "$/domain/entities/PaginatedResponse";
import { AuditsFilters } from "$/domain/usecases/GetAuditsUseCase";
export interface AuditRepository {
    getAll(filters: AuditsFilters): FutureData<PaginatedResponse<Audit>>;
}
