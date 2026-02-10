import { AuditRepository } from "$/domain/repositories/AuditRepository";
import { D2Api } from "$/types/d2-api";
import { FutureData } from "$/data/api-futures";
import { Future } from "$/domain/entities/generic/Future";
import { Audit } from "$/domain/entities/Audit";
import { generateUid } from "$/utils/uid";
import { PaginatedResponse } from "$/domain/entities/PaginatedResponse";
import { ensureSQLView } from "$/data/utils/ensureSQLView";
import { Dhis2SqlViews, SqlViewGetData } from "$/data/sql-view/Dhis2SqlViews";
import { AuditsFilters } from "$/domain/usecases/GetAuditsUseCase";
import { encodeUsername } from "$/data/utils/usernameEncoder";
import { Maybe } from "$/utils/ts-utils";

const SCRIPT_LOGS_USERNAME = "adrian@eyeseetea.com";

export class AuditD2Repository implements AuditRepository {
    private sqlViewId: Maybe<string> = undefined;

    constructor(private api: D2Api) {}

    private ensureSqlView(): FutureData<string> {
        if (this.sqlViewId) {
            return Future.success(this.sqlViewId);
        }

        return ensureSQLView(this.api).map(viewId => {
            this.sqlViewId = viewId;
            return viewId;
        });
    }

    public getAll(filters: AuditsFilters): FutureData<PaginatedResponse<Audit>> {
        return this.ensureSqlView().flatMap(viewId => {
            const variables: Record<string, string> = {
                startDate: filters.startDate || "1970-01-01",
                endDate: filters.endDate || "2100-12-31",
                username: filters.username ? encodeUsername(filters.username) : "ALL",
                dataType: filters.dataType || "ALL",
                excludedProgramId: filters.excludedProgramId ?? "ANY",
                excludedUser: filters.excludeScriptLogs
                    ? encodeUsername(SCRIPT_LOGS_USERNAME)
                    : "ANY",
            };

            return new Dhis2SqlViews(this.api)
                .query(viewId, variables, {
                    page: filters.page,
                    pageSize: filters.pageSize,
                })
                .map(response => {
                    const objects = this.mapSqlViewResponseToAudits(response);

                    return {
                        objects,
                        pager: response.pager,
                    };
                });
        });
    }

    private mapSqlViewResponseToAudits(response: SqlViewGetData<string>): Audit[] {
        return response.rows.map((row: Record<string, string>) => {
            const getValue = (key: string) => row[key] || "";

            return new Audit({
                id: generateUid(),
                created: getValue("created"),
                modifiedBy: getValue("modifiedby"),
                auditType: getValue("audittype"),
                value: getValue("value"),
                dataType: getValue("datatype"),
                related: getValue("related"),
            });
        });
    }
}
