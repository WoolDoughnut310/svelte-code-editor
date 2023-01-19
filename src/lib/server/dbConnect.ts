import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */

declare global {
	// eslint-disable-next-line no-var
	var mongoose: {
		conn: typeof import('mongoose') | null;
		promise: Promise<typeof import('mongoose')> | null;
		bucket: GridFSBucket | null;
	};
}

let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null, bucket: null };
}

async function dbConnect() {
	if (!MONGODB_URI) return;

	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: false
		};

		cached.promise = mongoose.connect(MONGODB_URI, opts);
		mongoose.mongo.GridFSBucket;
	}

	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		throw e;
	}

	return cached.conn;
}

export default dbConnect;

export async function getBucket() {
	if (!cached.conn) await dbConnect();
	const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
	return bucket;
}
