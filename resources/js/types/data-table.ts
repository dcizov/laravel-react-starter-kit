import '@tanstack/react-table';

export type DataTablePaginationMeta = {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
};

export type DataTableServerChangeParams = {
    page?: number;
    perPage?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
};

declare module '@tanstack/react-table' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData, TValue> {
        className?: string;
        headerClassName?: string;
        cellClassName?: string;
        label?: string;
    }
}
