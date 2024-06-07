import { startStandaloneServer } from '@apollo/server/standalone';
import express from 'express'
import mongoose from 'mongoose'
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ApolloServer } from "@apollo/server";
import { MongoMemoryServer } from 'mongodb-memory-server';
import Item from './models/Item'
import resolvers from './resolvers';
const itemsData = JSON.parse(readFileSync(path.resolve(__dirname, './data/items.json'), 'utf-8'));
const app = express();
const port = 4001;


const startServer = async () => {
	try {
		const mongoServer = await MongoMemoryServer.create();
		const uri = mongoServer.getUri();
		
		const typeDefs = readFileSync(path.resolve(__dirname, '../schema.graphql'), 'utf-8');
		
		const server = new ApolloServer({
			typeDefs,
			resolvers,
		});
		
		await mongoose.connect(uri);
		console.log('MongoDB connected');
		
		const count = await Item.countDocuments();
		if (count === 0) {
			await Item.insertMany(itemsData);
			console.log('Inserted initial data');
		}
		
		const { url } = await startStandaloneServer(server, {
			listen: { port },
		});
		
		app.use((req, res, next) => {
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Headers', '*');
			next();
		});
		
		app.listen(port, () => {
			console.log(`Server running at http://localhost:${port}`);
		});
		
		console.log(`🚀 Apollo Server ready at ${url}`);
	} catch (error) {
		console.log('Server Error: ', error);
	}
};

void startServer().catch(error => console.log('Server Error: ', error));