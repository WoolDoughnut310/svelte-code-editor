import { ObjectId } from 'mongodb';
import mongoose, { Document, type InferSchemaType } from 'mongoose';
import Delta, { Op } from 'quill-delta';
const { Schema } = mongoose;

const projectSchema = new Schema(
	{
		creator: { type: String, required: true },
		name: { type: String, required: true, lowercase: true, trim: true }
	},
	{
		methods: {
			traverseFiles: async function (cb) {
				const model = mongoose.model('DirectoryObject');

				// Get top-level directory objects
				const rootObjects = await model.find().exists('project', false).exec();
				
				const directory = []
				
				rootObjects.forEach((rootObject) => {
					directory.push(traverse(rootObject))
				})
			}
			,
			traverse: function traverse (obj: Document<typeof DirectoryObject>) {
				if (obj.type === "file") {
					return obj;
				}

				obj.
				
				const b = new DirectoryObject();
				b.findChildren

				const folder = [];
				const children = obj.findChildren().exec();

				children.forEach((child) => {
					folder.push(traverse(child));
				})

				return folder;
			}
		}
	}
);



import dbConnect from '../server/dbConnect';
import DirectoryObject, { type DirectoryObject } from './DirectoryObject';

interface FileMetadata {
	type: 'file' | 'folder';
	projectId: string;
	parentId: string;
}

type Directory = (string | string[] | Directory)[];

export async function traverseProject(projectId: string) {
	await dbConnect();
	const bucket = mongoose.bucket;
	if (!bucket) return [];

	const rootItems = bucket.find({
		metadata: {
			projectId,
			root: true
		}
	});
}

export default function traverse(parentId: string) {
	const bucket = mongoose.bucket;
	if (!bucket) return [];

	const directory: Directory = [];

	const items = bucket.find({
		metadata: {
			parentId
		}
	});

	items.forEach((item) => {
		const metadata = item.metadata as FileMetadata;

		if (metadata.type === 'file') {
			directory.push(item.filename);
		} else {
			directory.push(traverse(item._id.toString()));
		}
	});

	return directory;
}
