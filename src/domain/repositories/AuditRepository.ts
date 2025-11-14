import { FutureData } from "$/data/api-futures";
import { DataValueAudit } from "$/domain/entities/DataValueAudit";
import { PaginatedResponse, PaginationParams } from "$/domain/entities/PaginatedResponse";

export interface AuditRepository {
    getAll(params: PaginationParams): FutureData<PaginatedResponse<DataValueAudit>>;
}
