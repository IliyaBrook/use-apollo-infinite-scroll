import Item from './models/Item'


interface queryInterface {
	cursor?: string;
	limit?: number;
	search?: string
}

const resolvers = {
	Query: {
		async items(_: any, {
			cursor,
			limit = 10,
			search
		}:queryInterface) {
			const query: any = {}
			if (search) {
				query.name = { $regex: search, $options: "i" };
			}
			if (cursor) {
				const lastItem = await Item.findById(cursor);
				if (lastItem) {
					query._id = { $lt: lastItem._id };
				}
			}
			const items = await Item.find(query)
				.sort({ _id: -1 })
				.limit(limit + 1);
			console.log('itemsResponse', items)
			return items
		}
	}
}

export default resolvers
