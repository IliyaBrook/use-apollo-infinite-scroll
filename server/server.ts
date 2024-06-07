import { startStandaloneServer } from '@apollo/server/standalone'
import mongoose from 'mongoose'
import { readFileSync } from 'node:fs';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ApolloServer } from "@apollo/server";
import resolvers from './resolvers';
import path from 'path';
import Item from './models/Item';

const itemsData = JSON.parse(readFileSync(path.resolve(__dirname, './data/items.json'), 'utf-8'));
const typeDefs = readFileSync(path.resolve(__dirname, '../schema.graphql'), 'utf-8');

async function startApolloServer() {
	const mongoDb = await MongoMemoryServer.create();
	const uri = mongoDb.getUri();

	await mongoose.connect(uri);
	const count = await Item.countDocuments();
	if (count === 0) {
		await Item.insertMany(itemsData);
		console.log('Inserted initial data');
	}

	const server = new ApolloServer({
		typeDefs,
		resolvers
	});

	const { url } = await startStandaloneServer(server, {
		listen: { port: 4001 },
	});

	console.log(`Server ready at ${url}`);
}

startApolloServer().catch(error => console.log('Server Error: ', error));