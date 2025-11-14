import { FutureData } from "$/data/api-futures";
import { DataValueAudit } from "$/domain/entities/DataValueAudit";

export interface AuditRepository {
    getAll(): FutureData<DataValueAudit[]>;
}
