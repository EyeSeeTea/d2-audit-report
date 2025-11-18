import i18n from "$/utils/i18n";
import {
    TableColumn,
    TableConfig,
    TablePagination,
    TableSorting,
    useObjectsTable,
} from "@eyeseetea/d2-ui-components";
import { DataValueAudit } from "$/domain/entities/DataValueAudit";
import { useCallback } from "react";
import { GetAuditsUseCase } from "$/domain/usecases/GetAuditsUseCase";

export function useAudits(getAudits: GetAuditsUseCase) {
    const getRows = useCallback(
        async (
            _search: string,
            paging: TablePagination,
            _sorting: TableSorting<DataValueAudit>
        ) => {
            const result = await getAudits
                .execute({ page: paging.page, pageSize: paging.pageSize })
                .toPromise();

            return result;
        },
        [getAudits]
    );

    return useObjectsTable(tableConfig, getRows);
}

const columns: TableColumn<DataValueAudit>[] = [
    {
        name: "created",
        text: i18n.t("Date"),
        sortable: false,
        getValue: row => (row.created ? new Date(row.created).toLocaleString() : "-"),
    },
    {
        name: "auditType",
        text: i18n.t("Type"),
        sortable: false,
    },
    {
        name: "dataElement",
        text: i18n.t("Data Element"),
        sortable: false,
        getValue: row => row.dataElement?.name || row.dataElement?.id || "-",
    },
    {
        name: "organisationUnit",
        text: i18n.t("Organisation Unit"),
        sortable: false,
        getValue: row => row.organisationUnit?.name || row.organisationUnit?.id || "-",
    },
    {
        name: "period",
        text: i18n.t("Period"),
        sortable: false,
        getValue: row => row.period?.id || "-",
    },
    {
        name: "value",
        text: i18n.t("Value"),
        sortable: false,
        getValue: row => row.value || "-",
    },
    {
        name: "modifiedBy",
        text: i18n.t("User"),
        sortable: false,
        getValue: row => row.modifiedBy || "-",
    },
];

const tableConfig: TableConfig<DataValueAudit> = {
    columns,
    actions: [],
    paginationOptions: {
        pageSizeOptions: [10, 25, 50, 100],
        pageSizeInitialValue: 10,
        renderPosition: {
            bottom: true,
            top: false,
        },
    },
    initialSorting: {
        field: "created",
        order: "desc",
    },
    searchBoxLabel: i18n.t("Search audits"),
};
