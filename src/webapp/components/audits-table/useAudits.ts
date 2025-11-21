import { TablePagination, TableSorting, useObjectsTable } from "@eyeseetea/d2-ui-components";
import { Audit } from "$/domain/entities/Audit";
import { useCallback, useState } from "react";
import { GetAuditsUseCase } from "$/domain/usecases/GetAuditsUseCase";
import { PaginatedResponse } from "$/domain/entities/PaginatedResponse";
import { tableConfig } from "$/webapp/components/audits-table/tableConfig";

export function useAudits(getAudits: GetAuditsUseCase) {
    const [error, setError] = useState<string | undefined>();

    const [startDate, setStartDate] = useState<Date | null>(getOneMonthAgo());
    const [endDate, setEndDate] = useState<Date | null>(new Date());

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

const getOneMonthAgo = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
};
