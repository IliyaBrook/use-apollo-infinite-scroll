import Item from './models/Item'
import paginate from "infinite-pagination-mongo";

interface queryInterface {
	cursor?: string;
	limit?: number;
	sortOrder?: "asc" | "desc";
	filters?: Record<string, any>;
}

const resolvers = {
	Query: {
		async items(_: any, {
			cursor,
			limit = 10,
			sortOrder,
			filters
		}:queryInterface) {
			
			const response =   await paginate(
				Item,
				{
					cursor,
					limit,
					sortOrder,
					filters,
					idKey: "_id",
				}
			);
			return response.items;
		}
	}
}

export default resolvers
