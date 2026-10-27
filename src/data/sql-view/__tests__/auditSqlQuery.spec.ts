import { describe, expect, it } from "vitest";
import { getAuditSqlQuery } from "$/data/sql-view/auditSqlQuery";

describe("getAuditSqlQuery", () => {
    it("uses pre-2.41 table names for 2.40", () => {
        const sqlQuery = getAuditSqlQuery("2.40.5");

        expect(sqlQuery).toContain("FROM trackedentitydatavalueaudit");
        expect(sqlQuery).toContain("JOIN programstageinstance");
    });

    it("uses renamed tracker tables for 2.41", () => {
        const sqlQuery = getAuditSqlQuery("2.41.10");

        expect(sqlQuery).toContain("FROM trackedentitydatavalueaudit");
        expect(sqlQuery).toContain("JOIN event ");
        expect(sqlQuery).not.toContain("programstageinstance");
    });

    it("uses change log tables for 2.42", () => {
        const sqlQuery = getAuditSqlQuery("2.42.6");

        expect(sqlQuery).toContain("FROM eventchangelog");
        expect(sqlQuery).toContain("FROM trackedentitychangelog");
        expect(sqlQuery).not.toContain("trackedentitydatavalueaudit");
    });

    it("uses tracker and single event change logs for 2.43", () => {
        const sqlQuery = getAuditSqlQuery("2.43.1");

        expect(sqlQuery).toContain("FROM trackereventchangelog");
        expect(sqlQuery).toContain("FROM singleeventchangelog");
        expect(sqlQuery).not.toContain("JOIN event ");
    });

    it("uses the latest query for newer and snapshot versions", () => {
        expect(getAuditSqlQuery("2.44-SNAPSHOT")).toBe(getAuditSqlQuery("2.43.1"));
    });

    it("fails for an unknown version format", () => {
        expect(() => getAuditSqlQuery("unknown")).toThrow("Unsupported DHIS2 version");
    });
});
