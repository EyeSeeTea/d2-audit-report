import { D2Api } from "$/types/d2-api";
import { FutureData, apiToFuture } from "$/data/api-futures";
import { Future } from "$/domain/entities/generic/Future";
import sqlQuery from "$/data/sql-view/d2-audit-report.sql?raw";

const SQL_VIEW_NAME = "d2-audit-report";

export function ensureSQLView(api: D2Api): FutureData<string> {
    return apiToFuture(
        api.models.sqlViews.get({
            filter: { name: { eq: SQL_VIEW_NAME } },
            fields: { id: true, name: true, description: true, sqlQuery: true, type: true },
        })
    ).flatMap(response => {
        const existingView = response.objects?.find(view => view.name === SQL_VIEW_NAME);

        if (existingView) {
            return Future.success(existingView.id);
        }

        return createSqlView(api, SQL_VIEW_NAME, sqlQuery);
    });
}

function createSqlView(api: D2Api, viewName: string, sqlQuery: string): FutureData<string> {
    const sqlViewData = {
        name: viewName,
        cacheStrategy: "NO_CACHE" as const,
        description: "SQL View for audit reports",
        sqlQuery: sqlQuery,
        type: "QUERY" as const,
        publicAccess: "--------",
    };

    return apiToFuture(api.models.sqlViews.post(sqlViewData)).map(response => response.uid);
}
