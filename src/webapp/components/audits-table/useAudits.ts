import i18n from "$/utils/i18n";
import {
    TableColumn,
    TableConfig,
    TablePagination,
    TableSorting,
    useObjectsTable,
} from "@eyeseetea/d2-ui-components";
import { Audit } from "$/domain/entities/Audit";
import { useCallback, useState } from "react";
import { GetAuditsUseCase } from "$/domain/usecases/GetAuditsUseCase";
import { PaginatedResponse } from "$/domain/entities/PaginatedResponse";

export function useAudits(getAudits: GetAuditsUseCase) {
    const [error, setError] = useState<string | undefined>();

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const getRows = useCallback(
        async (_search: string, paging: TablePagination, _sorting: TableSorting<Audit>) => {
            return new Promise<PaginatedResponse<Audit>>((resolve, reject) => {
                const formatDate = (date: Date | null | undefined): string | undefined => {
                    if (!date) return undefined;
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const day = String(date.getDate()).padStart(2, "0");
                    return `${year}-${month}-${day}`;
                };

                return getAudits
                    .execute({
                        page: paging.page,
                        pageSize: paging.pageSize,
                        startDate: formatDate(startDate),
                        endDate: formatDate(endDate),
                    })
                    .run(
                        response => {
                            resolve(response);
                        },
                        error => {
                            setError(error instanceof Error ? error.message : "Unknown error");
                            reject(error);
                        }
                    );
            });
        },
        [getAudits, startDate, endDate]
    );

    const onStartDateChange = useCallback((date: Date | null) => {
        setStartDate(date);
    }, []);

    const onEndDateChange = useCallback((date: Date | null) => {
        setEndDate(date);
    }, []);

    return {
        objectsListProps: useObjectsTable(tableConfig, getRows),
        error,
        startDate,
        endDate,
        onStartDateChange,
        onEndDateChange,
    };
}

const columns: TableColumn<Audit>[] = [
    {
        name: "created",
        text: i18n.t("Date"),
        sortable: false,
        getValue: row => (row.created ? row.created : "-"),
    },
    {
        name: "dataType",
        text: i18n.t("Data Type"),
        sortable: false,
        getValue: row => row.dataType || "-",
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

const tableConfig: TableConfig<Audit> = {
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
};
