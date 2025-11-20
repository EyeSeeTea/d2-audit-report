import { AuditRepository } from "$/domain/repositories/AuditRepository";
import { D2Api } from "$/types/d2-api";
import { FutureData } from "$/data/api-futures";
import { Future } from "$/domain/entities/generic/Future";
import { Audit } from "$/domain/entities/Audit";
import { AuditType } from "@eyeseetea/d2-api/api/audit";
import { generateUid } from "$/utils/uid";
import { PaginatedResponse } from "$/domain/entities/PaginatedResponse";
import { ensureSQLView } from "$/data/utils/ensureSQLView";
import { Dhis2SqlViews, SqlViewGetData } from "$/data/sql-view/Dhis2SqlViews";
import { AuditsFilters } from "$/domain/usecases/GetAuditsUseCase";

export class AuditD2Repository implements AuditRepository {
    private sqlViewId: string | null = null;

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
            return new Dhis2SqlViews(this.api)
                .query(
                    viewId,
                    {
                        startDate: filters.startDate || "1970-01-01",
                        endDate: filters.endDate || "2100-12-31",
                    },
                    {
                        page: filters.page,
                        pageSize: filters.pageSize,
                    }
                )
                .map(response => {
                    const objects = this.mapSqlViewResponseToAudits(response);
                    const pager = response.pager || {
                        page: filters.page,
                        pageSize: filters.pageSize,
                        total: objects.length,
                        pageCount: 1,
                    };

                    return {
                        objects,
                        pager: {
                            page: pager.page,
                            pageSize: pager.pageSize,
                            total: pager.total,
                            pageCount: pager.pageCount,
                        },
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
                modifiedBy: getValue("modifiedby") || undefined,
                auditType: getValue("audittype") as AuditType,
                value: getValue("value") || undefined,
                dataType: getValue("datatype"),
                related: getValue("related") || undefined,
            });
        });
    }
}
