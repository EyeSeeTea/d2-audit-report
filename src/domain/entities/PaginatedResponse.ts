export type PaginationParams = {
    page: number;
    pageSize: number;
};

export type Pager = {
    page: number;
    pageSize: number;
    total: number;
    pageCount: number;
};

export type PaginatedResponse<T> = {
    objects: T[];
    pager: Pager;
};
