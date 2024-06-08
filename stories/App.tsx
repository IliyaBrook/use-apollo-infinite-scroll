import { gql } from '@apollo/client'
import React, { ReactElement, useEffect, useState } from 'react'
import './App.scss'
import useApolloInfiniteScroll from '../src'
import useDebounce from './hooks/useDebounce'

interface ItemInt {
	name: string,
	description: string,
	id: string
}



const App = (): ReactElement => {
	
	const [sortBy, setSortBy] = useState<string>('');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
	const [filters, setFilters] = useState<Record<any, string>>({});
	const [debouncedFilters, setDebouncedFilters] = useState<Record<any, string>>({});
	
	const dFilter = useDebounce(filters, 500)
	
	useEffect(() => {
		setDebouncedFilters(dFilter)
	}, [dFilter])
	
	const {data, lastItemRef, loading } = useApolloInfiniteScroll<ItemInt[]>(gql`
		query itemsQuery($cursor: String, $limit: Int, $filters: FiltersInput, $sortBy: String, $sortOrder: String) {
			items(cursor: $cursor, limit: $limit, filters: $filters, sortBy: $sortBy, sortOrder: $sortOrder) {
				id
				name
				description
			}
		},
	`, {
		limit: 10,
		filters: debouncedFilters,
		sortBy: sortBy,
		sortOrder: sortOrder,
		suspense: false,
		dataKey: 'items',
		idKey: 'id'
	})
	
	
	const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSortBy(e.target.value);
	};
	
	const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSortOrder(e.target.value as 'asc' | 'desc');
	};
	
	const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFilters({
			...filters,
			[e.target.name]: e.target.value
		});
	};
	
	return (
		<div className="items-page">
			<h1>Items</h1>

			<div className="controls">
				<div className="sort-controls">
					<label>
						Sort By:
						<select value={sortBy} onChange={handleSortChange}>
							<option value="">None</option>
							<option value="name">Name</option>
							<option value="description">Description</option>
						</select>
					</label>
					<label>
						Sort Order:
						<select value={sortOrder} onChange={handleSortOrderChange}>
							<option value="asc">Ascending</option>
							<option value="desc">Descending</option>
						</select>
					</label>
				</div>
				<div className="filter-controls">
					<label>
						Filter by Name:
						<input
							type="text"
							name="name"
							value={filters.name || ''}
							onChange={handleFilterChange}
						/>
					</label>
					<label>
						Filter by Description:
						<input
							type="text"
							name="description"
							value={filters.description || ''}
							onChange={handleFilterChange}
						/>
					</label>
				</div>
			</div>

			<ul className="items-ul">
				{data?.map((item, index) => (
					<li
						key={item.id} className="item-list"
						ref={data.length - 1 === index ? lastItemRef as unknown as React.Ref<HTMLLIElement> : null}
					>
						<h2>{item.name}</h2>
						<p>{item.description}</p>
					</li>
				))}
			</ul>
			{loading && <p>Loading...</p>}
		</div>
	);
}

export default App