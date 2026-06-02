import { TablePagination, TableSorting } from "@eyeseetea/d2-ui-components";
import { Audit } from "$/domain/entities/Audit";
import { useCallback, useState, useEffect } from "react";
import { GetAuditsUseCase } from "$/domain/usecases/GetAuditsUseCase";
import { GetAllUsersUseCase } from "$/domain/usecases/GetAllUsersUseCase";
import { GetOrgUnitsUseCase } from "$/domain/usecases/GetOrgUnitsUseCase";
import { tableConfig } from "$/webapp/components/dhis2-audits/tableConfig";
import { User } from "$/domain/entities/User";
import { OrgUnit } from "$/domain/entities/OrgUnit";
import { Maybe } from "$/utils/ts-utils";
import { useDebounce } from "$/webapp/hooks/useDebounce";
import { GetRowsFuture, useObjectsTableFuture } from "$/webapp/hooks/useObjectsTableFuture";

export function useDhis2Audits(
    getAudits: GetAuditsUseCase,
    getAllUsers: GetAllUsersUseCase,
    getOrgUnits: GetOrgUnitsUseCase,
    excludedProgramId: Maybe<string>
) {
    const [error, setError] = useState<Maybe<string>>();
    const [users, setUsers] = useState<User[]>([]);
    const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);
    const [selectedOrgUnit, setSelectedOrgUnit] = useState<OrgUnit | null>(null);
    const [includeOrgUnitDescendants, setIncludeOrgUnitDescendants] = useState(true);
    const [orgUnitSearch, setOrgUnitSearch] = useState("");
    const debouncedOrgUnitSearch = useDebounce(orgUnitSearch, 300);
    const [orgUnitRequest, setOrgUnitRequest] = useState({ query: "", page: 1 });
    const [hasMoreOrgUnits, setHasMoreOrgUnits] = useState(false);
    const [isLoadingOrgUnits, setIsLoadingOrgUnits] = useState(false);

    const [startDate, setStartDate] = useState<Date | null>(getOneMonthAgo());
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [selectedUsername, setSelectedUsername] = useState<Maybe<string>>();
    const [selectedDataType, setSelectedDataType] = useState<Maybe<string>>();
    const [excludeScriptLogs, setExcludeScriptLogs] = useState(true);

    const getRows: GetRowsFuture<Audit> = useCallback(
        (_search: string, paging: TablePagination, _sorting: TableSorting<Audit>) => {
            return getAudits.execute({
                page: paging.page,
                pageSize: paging.pageSize,
                startDate: formatDate(startDate),
                endDate: formatDate(endDate),
                username: selectedUsername || undefined,
                dataType: selectedDataType,
                excludedProgramId: excludedProgramId,
                excludeScriptLogs: excludeScriptLogs,
                orgUnitIds: selectedOrgUnit ? [selectedOrgUnit.id] : undefined,
                includeOrgUnitDescendants,
            });
        },
        [
            getAudits,
            startDate,
            endDate,
            selectedUsername,
            selectedDataType,
            excludedProgramId,
            excludeScriptLogs,
            selectedOrgUnit,
            includeOrgUnitDescendants,
        ]
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

    const onExcludeScriptLogsChange = useCallback((value: boolean) => {
        setExcludeScriptLogs(value);
    }, []);

    const onOrgUnitChange = useCallback((orgUnit: OrgUnit | null) => {
        setSelectedOrgUnit(orgUnit);
        setIncludeOrgUnitDescendants(true);
    }, []);

    const onIncludeOrgUnitDescendantsChange = useCallback((value: boolean) => {
        setIncludeOrgUnitDescendants(value);
    }, []);

    const onOrgUnitSearch = useCallback((query: string) => {
        setOrgUnitSearch(query);
    }, []);

    const onOrgUnitsScrollEnd = useCallback(() => {
        if (hasMoreOrgUnits) {
            setOrgUnitRequest(r => ({ ...r, page: r.page + 1 }));
        }
    }, [hasMoreOrgUnits]);

    useEffect(() => {
        getAllUsers.execute().run(
            usersList => setUsers(usersList),
            error => setError(error instanceof Error ? error.message : "Error loading users")
        );
    }, [getAllUsers]);

    // When debounced search changes, reset to page 1.
    // Functional update preserves the same reference when values are already equal
    // so React bails out and avoids a spurious re-render (and cancel) on mount.
    useEffect(() => {
        setOrgUnitRequest(prev =>
            prev.query === debouncedOrgUnitSearch && prev.page === 1
                ? prev
                : { query: debouncedOrgUnitSearch, page: 1 }
        );
    }, [debouncedOrgUnitSearch]);

    // Load org units — cancel in-flight request on cleanup
    useEffect(() => {
        setIsLoadingOrgUnits(true);
        const cancel = getOrgUnits.execute(orgUnitRequest.query, orgUnitRequest.page).run(
            result => {
                setOrgUnits(prev =>
                    orgUnitRequest.page === 1 ? result.orgUnits : [...prev, ...result.orgUnits]
                );
                setHasMoreOrgUnits(result.hasMore);
                setIsLoadingOrgUnits(false);
            },
            err => {
                setError(err instanceof Error ? err.message : "Error loading org units");
                setIsLoadingOrgUnits(false);
            }
        );
        return cancel;
    }, [orgUnitRequest, getOrgUnits]);

    return {
        objectsListProps: useObjectsTableFuture(tableConfig, getRows),
        error,
        startDate,
        endDate,
        selectedUsername,
        selectedDataType,
        excludeScriptLogs,
        users,
        orgUnits,
        isLoadingOrgUnits,
        selectedOrgUnit,
        includeOrgUnitDescendants,
        onStartDateChange,
        onEndDateChange,
        onUsernameChange,
        onDataTypeChange,
        onExcludeScriptLogsChange,
        onOrgUnitChange,
        onOrgUnitSearch,
        onOrgUnitsScrollEnd,
        onIncludeOrgUnitDescendantsChange,
    };
}

const getOneMonthAgo = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
};

function formatDate(date: Date | null | undefined): string | undefined {
    if (!date) return undefined;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
