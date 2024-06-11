
# use-apollo-infinite-scroll

This package provides a custom hook `useApolloInfiniteScroll` to implement infinite scroll pagination using Apollo Client.

## Installation

You can install the package via npm or yarn:

```sh
npm install use-apollo-infinite-scroll
```

```sh
yarn add use-apollo-infinite-scroll
```

## Usage

### Here is an example of how to use the hook in component:

```jsx
import { gql } from '@apollo/client'
import React, { useState } from 'react'
import useApolloInfiniteScroll from 'use-apollo-infinite-scroll'

const ITEMS_QUERY = gql`
  query itemsQuery($cursor: String, $limit: Int) {
    items(cursor: $cursor, limit: $limit) {
      id
      name
    }
  }
`

const App = () => {
	const { data, lastItemRef, loading } = useApolloInfiniteScroll(ITEMS_QUERY, {
		limit: 10,
		dataKey: 'items',
		idKey: 'id',
		populate: 'user',
	})
	
	return (
		<div>
			<h1>Items</h1>
			<ul>
				{data?.map((item, index) => (
					<li key={item.id} ref={data.length - 1 === index ? lastItemRef : null}>
						{item.name}
					</li>
				))}
			</ul>
			{loading && <p>Loading...</p>}
		</div>
	)
}

export default App
```

### Props

* **idKey** - The key used to identify each item (default: 'id').
* **dataKey** - The key in the response data where the list of items is located.
* **suspense** - A boolean to determine if suspense mode is used.
* **variables** - Additional variables to pass to the query.
* **limit** - Number of items to fetch per request (default: 30).
* **sortOrder** - Order to sort the items ('asc' or 'desc').
* **filters** - Filter object to filter the items.

## License

This project is licensed under the MIT License.

## Development

To start the development server, run:

```sh
yarn dev
```
