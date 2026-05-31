export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
    timestamp: string |null;
}

export interface Page<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    first?: boolean;
    last: boolean;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}