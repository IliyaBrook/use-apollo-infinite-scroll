import type { QueryResult, UseSuspenseQueryResult } from '@apollo/client'
import type { OperationVariables } from '@apollo/client/core'

export interface UseApolloInfiniteScrollProps<
	_TData,
	TVariables extends OperationVariables & {
		limit: number
		sortOrder?: 'asc' | 'desc'
		filters?: Record<string, any>
	}
> {
	idKey?: string
	dataKey?: string
	suspense?: boolean
	variables?: TVariables;
	populate?: string;
	limit: number;
	sortOrder?: 'asc' | 'desc';
	filters?: Record<string, any>;
}

export type UseApolloInfiniteScrollReturn<
	TData,
	TVariables extends OperationVariables & {
		limit: number
		sortOrder?: 'asc' | 'desc'
		filters?: Record<string, any>
	}
> = (UseSuspenseQueryResult<TData> | QueryResult<TData>) & {
	data: TData | undefined
	loading: boolean
	error: any
	fetchMore: (variables?: TVariables) => void
	lastItemRef: (node: HTMLDivElement | null) => void
}