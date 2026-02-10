import { TablePagination, TableSorting, useObjectsTable } from "@eyeseetea/d2-ui-components";
import { Audit } from "$/domain/entities/Audit";
import { useCallback, useState, useEffect } from "react";
import { GetAuditsUseCase } from "$/domain/usecases/GetAuditsUseCase";
import { GetAllUsersUseCase } from "$/domain/usecases/GetAllUsersUseCase";
import { PaginatedResponse } from "$/domain/entities/PaginatedResponse";
import { tableConfig } from "$/webapp/components/dhis2-audits/tableConfig";
import { User } from "$/domain/entities/User";
import { Maybe } from "$/utils/ts-utils";

export function useDhis2Audits(
    getAudits: GetAuditsUseCase,
    getAllUsers: GetAllUsersUseCase,
    excludedProgramId: Maybe<string>
) {
    const [error, setError] = useState<Maybe<string>>();
    const [users, setUsers] = useState<User[]>([]);

    const [startDate, setStartDate] = useState<Date | null>(getOneMonthAgo());
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [selectedUsername, setSelectedUsername] = useState<Maybe<string>>();
    const [selectedDataType, setSelectedDataType] = useState<Maybe<string>>();

    const getRows = useCallback(
        async (_search: string, paging: TablePagination, _sorting: TableSorting<Audit>) => {
            return new Promise<PaginatedResponse<Audit>>((resolve, reject) => {
                const formatDate = (date: Date | null | undefined): Maybe<string> => {
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
                        username: selectedUsername || undefined,
                        dataType: selectedDataType,
                        excludedProgramId: excludedProgramId,
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
        [getAudits, startDate, endDate, selectedUsername, selectedDataType, excludedProgramId]
    );

    const onStartDateChange = useCallback((date: Date | null) => {
        setStartDate(date);
    }, []);

    const onEndDateChange = useCallback((date: Date | null) => {
        setEndDate(date);
    }, []);

    const onUsernameChange = useCallback((username: Maybe<string>) => {
        setSelectedUsername(username);
    }, []);

    const onDataTypeChange = useCallback((dataType: Maybe<string>) => {
        setSelectedDataType(dataType);
    }, []);

    useEffect(() => {
        getAllUsers.execute().run(
            usersList => {
                setUsers(usersList);
            },
            error => {
                setError(error instanceof Error ? error.message : "Error loading users");
            }
        );
    }, [getAllUsers]);

    return {
        objectsListProps: useObjectsTable(tableConfig, getRows),
        error,
        startDate,
        endDate,
        selectedUsername,
        selectedDataType,
        users,
        onStartDateChange,
        onEndDateChange,
        onUsernameChange,
        onDataTypeChange,
    };
}

const getOneMonthAgo = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
};
