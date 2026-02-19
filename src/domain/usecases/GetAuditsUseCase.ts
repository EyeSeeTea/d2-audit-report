import { FutureData } from "$/data/api-futures";
import { Audit } from "$/domain/entities/Audit";
import { PaginatedResponse } from "$/domain/entities/PaginatedResponse";
import { AuditRepository } from "$/domain/repositories/AuditRepository";
import { UserRepository } from "$/domain/repositories/UserRepository";

export type AuditsFilters = {
    startDate?: string;
    endDate?: string;
    username?: string;
    dataType?: string;
    page: number;
    pageSize: number;
    excludedProgramId?: string;
    excludeScriptLogs?: boolean;
    /** UIDs de organisation units a las que el usuario tiene acceso; si no se pasa, el use case lo obtiene del usuario actual */
    orgUnitIds?: string[];
};

export class GetAuditsUseCase {
    constructor(
        private auditRepository: AuditRepository,
        private userRepository: UserRepository
    ) {}

    public execute(filters: AuditsFilters): FutureData<PaginatedResponse<Audit>> {
        return this.userRepository.getCurrent().flatMap(currentUser => {
            const orgUnitIds =
                currentUser.orgUnits.length > 0
                    ? currentUser.orgUnits.map(ou => ou.id)
                    : undefined;
            return this.auditRepository.getAll({
                ...filters,
                orgUnitIds,
            });
        });
    }
}
