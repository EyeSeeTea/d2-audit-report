import { D2Api } from "$/types/d2-api";
import { FutureData, apiToFuture } from "$/data/api-futures";
import sqlQuery from "$/data/sql-view/d2-audit-report.sql?raw";
import { Future } from "$/domain/entities/generic/Future";

const SQL_VIEW_NAME = "d2-audit-report";

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
            //return updateSqlView(api, existingView.id);
            return Future.success(existingView.id);
        }
    });
}

// function updateSqlView(api: D2Api, viewId: string): FutureData<string> {
//     const sqlViewDataToEdit = { ...sqlViewData, id: viewId };

//     return apiToFuture(api.models.sqlViews.put(sqlViewDataToEdit)).map(() => viewId);
// }

function createSqlView(api: D2Api): FutureData<string> {
    return apiToFuture(api.models.sqlViews.post(sqlViewData)).map(response => response.uid);
}

const sqlViewData = {
    name: SQL_VIEW_NAME,
    cacheStrategy: "NO_CACHE" as const,
    description: "SQL View for audit reports",
    sqlQuery: sqlQuery,
    type: "QUERY" as const,
    publicAccess: "--------",
};
