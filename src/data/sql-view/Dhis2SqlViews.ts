import { Pager } from "$/domain/entities/PaginatedResponse";
import { Id } from "$/domain/entities/Ref";
import { D2Api } from "$/types/d2-api";
import { HashMap } from "$/domain/entities/generic/HashMap";
import { apiToFuture, FutureData } from "$/data/api-futures";

/**
 * Pagination is realized in SQLView endpoint inmemory in java code,
 * This class asume pagination in SqlView transforming
 * pagging parameters to variables (limit, offset) for the SqlView endpoint.
 */
export class Dhis2SqlViews {
    constructor(private api: D2Api) {}

    query<Variables extends {}, Field extends string>(
        id: Id,
        variables?: Variables,
        paging?: SqlViewPaging
    ): FutureData<SqlViewGetData<Field>> {
        /*
        Example:

            GET /api/sqlViews/ID/data
                    ?var=orgUnitId:H8RixfF8ugH
                    ?var=period:2018
                    &var=pageSize:50
                    &var=offset:100
                    &fields=id,name
                    &filter=name:like:abc
        */
        const variableParams = HashMap.fromObject(variables || {})
            .toPairs()
            .map(([key, value]) => `${key}:${value}`);

        if (paging?.pageSize !== undefined) {
            variableParams.push(`pageSize:${paging.pageSize}`);
        }
        if (paging?.page !== undefined && paging?.pageSize !== undefined) {
            const offset = (paging.page - 1) * paging.pageSize;
            variableParams.push(`offset:${offset}`);
        }

        const params: Record<string, any> = { var: variableParams };

        return apiToFuture(
            this.api
                .get<SqlViewDataResponse<Field>>(`/sqlViews/${id}/data`, params)
                .map(({ data }) => {
                    const columns = data.listGrid.headers.map(header => header.column);
                    const rows = data.listGrid.rows.map(
                        row =>
                            Object.fromEntries(columns.map((col, i) => [col, row[i]])) as Record<
                                Field,
                                string
                            >
                    );

                    const page = paging?.page || 1;
                    const pageSize = paging?.pageSize || 50;

                    const estimatedPager = {
                        page,
                        pageSize,
                        total: page * pageSize + 1,
                        pageCount: 1,
                    };

                    return { pager: estimatedPager, rows };
                })
        );
    }
}

export interface SqlViewPaging {
    page?: number;
    pageSize?: number;
}

export interface SqlViewGetData<Field extends string> {
    pager: Pager;
    rows: Array<Record<Field, string>>;
}

export interface SqlViewDataResponse<Field extends string> {
    pager: Pager;
    listGrid: {
        metaData: {};
        headerWidth: number;
        width: number;
        title: string;
        height: number;
        headers: SqlViewDataHeader<Field>[];
        rows: Row[];
    };
}

export type Row = string[];

export interface SqlViewDataHeader<Field extends string> {
    hidden: boolean;
    meta: boolean;
    name: string;
    column: Field;
    type: string;
}
