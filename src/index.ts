import type { UseApolloInfiniteScrollProps, UseApolloInfiniteScrollReturn } from '@/types/types'
import {
	useQuery,
	useSuspenseQuery,
} from '@apollo/client'
import type { OperationVariables } from '@apollo/client/core'
import type { DocumentNode } from 'graphql/language'
import { useCallback, useEffect, useRef, useState } from 'react'

const useApolloInfiniteScroll = <
	TData = any,
	TVariables extends OperationVariables & {
		limit: number
		sortOrder?: 'asc' | 'desc'
		filters?: Record<string, any>
	} = {
		limit: number
		sortOrder?: 'asc'
		filters?: Record<string, any>
	}
>(
	query: DocumentNode,
	hookOptions: UseApolloInfiniteScrollProps<TData, TVariables>
): UseApolloInfiniteScrollReturn<TData, TVariables> => {
	const [hasMore, setHasMore] = useState(true)
	
	const {
		suspense,
		limit = 30,
		sortOrder,
		filters,
		dataKey,
		populate,
		idKey = '_id',
		variables,
		...restHookOptions
	}: UseApolloInfiniteScrollProps<TData, TVariables> = hookOptions
	
	const queryHook: typeof useQuery | typeof useSuspenseQuery = suspense
		? useSuspenseQuery
		: useQuery
	
	const {
		data: response,
		fetchMore,
		refetch,
		...queryResult
		// @ts-ignore
	} = queryHook<TData, TVariables>(query, {
		variables: {
			cursor: null,
			limit,
			sortOrder,
			filters,
			...variables
		},
		errorPolicy: 'all',
		...restHookOptions
	})
	
	const observer = useRef<IntersectionObserver>()
	const data = response?.[dataKey] ? response?.[dataKey] : response
	
	const lastItemRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (observer.current) observer.current.disconnect()
			observer.current = new IntersectionObserver(entries => {
				if (entries[0].isIntersecting && data.length > 0 && hasMore) {
					const cursor = data[data.length - 1]?.[idKey]
					void fetchMore({
						variables: { cursor, limit, sortOrder, filters },
						updateQuery: (previousResult: TData, { fetchMoreResult }) => {
							if (!fetchMoreResult || fetchMoreResult?.[dataKey].length === 0) {
								setHasMore(false)
								return previousResult
							}
							return {
								[dataKey]: [
									...(previousResult?.[dataKey] || []),
									...(fetchMoreResult?.[dataKey] || [])
								]
							}
						}
					})
				}
			})
			if (node) observer.current.observe(node)
		},
		[data, fetchMore, hasMore, sortOrder, JSON.stringify(filters)]
	)
	
	useEffect(() => {
		setHasMore(true)
		void refetch({
			cursor: null, limit, sortOrder, filters
		})
	}, [limit, sortOrder, sortOrder, JSON.stringify(filters)])
	
	return {
		...queryResult,
		data,
		loading: queryResult.loading ?? !response,
		error: response?.error,
		fetchMore,
		lastItemRef
	}
}

export default useApolloInfiniteScroll
