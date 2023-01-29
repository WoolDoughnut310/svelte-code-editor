import mongoose, { mongo } from 'mongoose';
import { MONGODB_URI } from '$env/static/private';

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
		bucket: InstanceType<typeof mongo.GridFSBucket> | null;
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
		cached.promise = mongoose.connect(MONGODB_URI); //, opts);
	}

	try {
		cached.conn = await cached.promise;
		cached.bucket = new mongo.GridFSBucket(mongoose.connection.db);
	} catch (e) {
		cached.promise = null;
		throw e;
	}

	return cached.conn;
}

export default dbConnect;
