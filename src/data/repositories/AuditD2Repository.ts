import { AuditRepository } from "$/domain/repositories/AuditRepository";
import { D2Api } from "$/types/d2-api";
import { apiToFuture, FutureData } from "$/data/api-futures";
import { DataValueAudit } from "$/domain/entities/DataValueAudit";
import { AuditType } from "@eyeseetea/d2-api/api/audit";
import { NamedRef } from "$/domain/entities/Ref";
import { Ref } from "@eyeseetea/d2-api";
import { generateUid } from "$/utils/uid";
import { PaginatedResponse, PaginationParams } from "$/domain/entities/PaginatedResponse";

export class AuditD2Repository implements AuditRepository {
    constructor(private api: D2Api) {}

    public getAll(params: PaginationParams): FutureData<PaginatedResponse<DataValueAudit>> {
        return apiToFuture(
            this.api.get<D2AuditsResponse>(`/audits/dataValue`, {
                fields: dataValueFields,
                page: params.page,
                pageSize: params.pageSize,
            })
        ).map(response => {
            const objects = response.dataValueAudits.map(d2Audit => this.buildAudit(d2Audit));
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
    }

    private buildAudit(d2Audit: D2DataValueAudit): DataValueAudit {
        return new DataValueAudit({
            id: generateUid(), // Audit does not have an id, so we generate a uid
            created: d2Audit.created,
            modifiedBy: d2Audit.modifiedBy,
            auditType: d2Audit.auditType,
            value: d2Audit.value,
            period: d2Audit.period,
            organisationUnit: d2Audit.organisationUnit,
            attributeOptionCombo: d2Audit.attributeOptionCombo,
            categoryOptionCombo: d2Audit.categoryOptionCombo,
            dataElement: d2Audit.dataElement,
        });
    }
}

const dataValueFields =
    "id,created,modifiedBy,auditType,value,period[id,name],organisationUnit[id,name],attributeOptionCombo[id,name],categoryOptionCombo[id,name],dataElement[id,name]";

export interface D2DataValueAudit {
    created: string;
    modifiedBy: string;
    auditType: AuditType;
    value: string;
    period: Ref;
    organisationUnit: NamedRef;
    attributeOptionCombo: NamedRef;
    categoryOptionCombo: NamedRef;
    dataElement: NamedRef;
}

type D2AuditsResponse = {
    dataValueAudits: D2DataValueAudit[];
    pager?: {
        page: number;
        pageSize: number;
        total: number;
        pageCount: number;
    };
};
