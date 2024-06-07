export interface PaginationResult<T> {
	items: T[];
	hasNextPage: boolean;
}

export interface WithInfinitePaginationProps {
	endpoint: string;
	limit: number;
	search?: string;
	clientType: 'fetch' | 'apollo';
}