import sqlQuery40 from "$/data/sql-view/d2-audit-report-40.sql?raw";
import sqlQuery41 from "$/data/sql-view/d2-audit-report-41.sql?raw";
import sqlQuery42 from "$/data/sql-view/d2-audit-report-42.sql?raw";
import sqlQuery43 from "$/data/sql-view/d2-audit-report-43.sql?raw";

/**
 * DHIS2 renamed and replaced the audit tables across versions:
 *   2.41: programstageinstance -> event, trackedentityinstance -> trackedentity,
 *         programinstance -> enrollment, trackedentityinstanceaudit -> trackedentityaudit
 *   2.42: trackedentitydatavalueaudit -> eventchangelog,
 *         trackedentityattributevalueaudit -> trackedentitychangelog
 *   2.43: event -> trackerevent + singleevent, eventchangelog -> trackereventchangelog + singleeventchangelog
 * Versions newer than the latest supported one use the latest query.
 */
export function getAuditSqlQuery(dhis2Version: string): string {
    const minorVersion = getMinorVersion(dhis2Version);

    if (minorVersion >= 43) return sqlQuery43;
    if (minorVersion === 42) return sqlQuery42;
    if (minorVersion === 41) return sqlQuery41;
    return sqlQuery40;
}

function getMinorVersion(dhis2Version: string): number {
    const match = dhis2Version.match(/^2\.(\d+)/);
    if (!match?.[1]) throw new Error(`Unsupported DHIS2 version: ${dhis2Version}`);

    return Number(match[1]);
}
