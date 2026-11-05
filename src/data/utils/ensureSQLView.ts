import { D2Api } from "$/types/d2-api";
import { FutureData, apiToFuture } from "$/data/api-futures";
import { Future } from "$/domain/entities/generic/Future";
import { getAuditSqlQuery } from "$/data/sql-view/auditSqlQuery";

const SQL_VIEW_NAME = "d2-audit-report";

/**
 * Creates the SQL view for the DHIS2 version of the instance if it does not exist.
 * An existing SQL view is never updated from the app: it is updated manually or via API.
 */
export function ensureSQLView(api: D2Api): FutureData<string> {
    return apiToFuture(
        api.models.sqlViews.get({
            filter: { name: { eq: SQL_VIEW_NAME } },
            fields: { id: true, name: true, description: true, sqlQuery: true, type: true },
        })
    ).flatMap(response => {
        const existingView = response.objects?.find(view => view.name === SQL_VIEW_NAME);

        if (!existingView) {
            return createSqlView(api);
        } else {
            return Future.success(existingView.id);
        }
    });
}

function createSqlView(api: D2Api): FutureData<string> {
    return apiToFuture(api.system.info)
        .flatMap(systemInfo =>
            apiToFuture(api.models.sqlViews.post(buildSqlViewData(systemInfo.version)))
        )
        .map(response => response.uid);
}

const PUBLIC_ACCESS_METADATA_AND_DATA = "rwrw----";

function buildSqlViewData(dhis2Version: string) {
    return {
        name: SQL_VIEW_NAME,
        cacheStrategy: "NO_CACHE" as const,
        description: "SQL View for audit reports",
        sqlQuery: getAuditSqlQuery(dhis2Version),
        type: "QUERY" as const,
        publicAccess: PUBLIC_ACCESS_METADATA_AND_DATA,
    };
}
