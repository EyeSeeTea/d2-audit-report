import { AuditRepository } from "$/domain/repositories/AuditRepository";
import { D2Api } from "$/types/d2-api";
import { FutureData } from "$/data/api-futures";
import { Future } from "$/domain/entities/generic/Future";
import { DataValueAudit } from "$/domain/entities/DataValueAudit";
import { AuditType } from "@eyeseetea/d2-api/api/audit";
import { generateUid } from "$/utils/uid";
import { PaginatedResponse, PaginationParams } from "$/domain/entities/PaginatedResponse";
import { ensureSQLView } from "$/data/utils/ensureSQLView";
import { Dhis2SqlViews, SqlViewGetData } from "$/data/sql-view/Dhis2SqlViews";

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

    public getAll(params: PaginationParams): FutureData<PaginatedResponse<DataValueAudit>> {
        return this.ensureSqlView().flatMap(viewId => {
            return new Dhis2SqlViews(this.api)
                .query(viewId, undefined, {
                    page: params.page,
                    pageSize: params.pageSize,
                })
                .map(response => {
                    const objects = this.mapSqlViewResponseToAudits(response);
                    const pager = response.pager || {
                        page: params.page,
                        pageSize: params.pageSize,
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

    private mapSqlViewResponseToAudits(response: SqlViewGetData<string>): DataValueAudit[] {
        return response.rows.map((row: Record<string, string>) => {
            const getValue = (key: string) => row[key] || "";

            return new DataValueAudit({
                id: generateUid(),
                created: getValue("created"),
                modifiedBy: getValue("modifiedby") || undefined,
                auditType: getValue("audittype") as AuditType,
                value: getValue("value") || undefined,
                period: {
                    id: getValue("period_id"),
                },
                organisationUnit: {
                    id: getValue("organisationunit_id"),
                    name: getValue("organisationunit_name"),
                },
                attributeOptionCombo: {
                    id: getValue("attributeoptioncombo_id"),
                    name: getValue("attributeoptioncombo_name"),
                },
                categoryOptionCombo: {
                    id: getValue("categoryoptioncombo_id"),
                    name: getValue("categoryoptioncombo_name"),
                },
                dataElement: {
                    id: getValue("dataelement_id"),
                    name: getValue("dataelement_name"),
                },
            });
        });
    }
}
