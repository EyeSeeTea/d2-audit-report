import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    ReferenceObject,
    TableConfig,
    TablePagination,
    TableSorting,
    TableState,
    Pager,
} from "@eyeseetea/d2-ui-components";
import { ObjectsListProps } from "@eyeseetea/d2-ui-components";
import { FutureData } from "$/data/api-futures";
import { Cancel } from "$/domain/entities/generic/Future";
import i18n from "$/utils/i18n";

export type GetRowsFuture<Obj extends ReferenceObject> = (
    search: string,
    paging: TablePagination,
    sorting: TableSorting<Obj>
) => FutureData<{ objects: Obj[]; pager: Pager }>;

interface State<Obj extends ReferenceObject> {
    rows: Obj[] | undefined;
    pagination: TablePagination;
    sorting: TableSorting<Obj>;
    isLoading: boolean;
}

export function useObjectsTableFuture<Obj extends ReferenceObject>(
    config: TableConfig<Obj>,
    getRows: GetRowsFuture<Obj>
): ObjectsListProps<Obj> {
    const initialState = useMemo(
        () => ({
            pagination: {
                page: 1,
                pageSize: config.paginationOptions.pageSizeInitialValue ?? 20,
                total: 0,
            },
            sorting: config.initialSorting,
            selection: config.initialSelection,
        }),
        [
            config.initialSelection,
            config.initialSorting,
            config.paginationOptions.pageSizeInitialValue,
        ]
    );

    const [state, setState] = useState<State<Obj>>(() => ({
        rows: undefined,
        pagination: initialState.pagination,
        sorting: initialState.sorting,
        isLoading: false,
    }));

    const [search, setSearch] = useState(config.initialSearch ?? "");
    const cancelRef = useRef<Cancel>(undefined);

    const loadRows = useCallback(
        (sorting: TableSorting<Obj>, pagination: Partial<TablePagination>) => {
            cancelRef.current?.();
            setState(s => ({ ...s, isLoading: true }));

            const paging = { ...initialState.pagination, ...pagination } as TablePagination;

            cancelRef.current = getRows(search.trim(), paging, sorting).run(
                res => {
                    cancelRef.current = undefined;
                    setState({
                        rows: res.objects,
                        pagination: { ...pagination, ...res.pager } as TablePagination,
                        sorting,
                        isLoading: false,
                    });
                },
                _error => {
                    cancelRef.current = undefined;
                    setState(s => ({ ...s, isLoading: false }));
                }
            );
        },
        [getRows, search, initialState.pagination]
    );

    const reload = useCallback(() => {
        loadRows(state.sorting, state.pagination);
    }, [loadRows, state.sorting, state.pagination]);

    useEffect(() => {
        loadRows(config.initialSorting, initialState.pagination);
        return () => cancelRef.current?.();
    }, [config.initialSorting, loadRows, initialState.pagination]);

    const onChange = useCallback(
        (newState: TableState<Obj>) => {
            loadRows(newState.sorting, newState.pagination);
        },
        [loadRows]
    );

    return {
        ...config,
        isLoading: state.isLoading,
        rows: state.rows ?? [],
        onChange,
        pagination: state.pagination,
        searchBoxLabel: config.searchBoxLabel || i18n.t("Search by name"),
        onChangeSearch: setSearch,
        reload,
        initialState,
    };
}
