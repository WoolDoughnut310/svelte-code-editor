import { ObjectId } from 'mongodb';
import mongoose, { Model, type HydratedDocument } from 'mongoose';
import type { Op } from 'quill-delta';
const { Schema } = mongoose;

export interface IDirectoryObject {
	type: 'file' | 'folder';
	parent: ObjectId;
	name: string;
	content?: Op[];
	fileId?: string;
}

export type DirectoryObjectDocument = HydratedDocument<IDirectoryObject, IDirectoryObjectMethods>;

export interface IDirectoryObjectMethods {
	findChildren(): Promise<{ [key: string]: DirectoryObjectDocument }>;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type DirectoryObjectModel = Model<IDirectoryObject, {}, IDirectoryObjectMethods>;

const directoryObjectSchema = new Schema<
	IDirectoryObject,
	DirectoryObjectModel,
	IDirectoryObjectMethods
>(
	{
		type: { type: String, enum: ['file', 'folder'] },
		parent: ObjectId,
		name: { type: String, required: true, trim: true },
		content: Object,
		fileId: {
			type: ObjectId,
			ref: 'files'
		}
	},
	{
		timestamps: true
	}
);

directoryObjectSchema.method('findChildren', async function findChildren() {
	const model: DirectoryObjectModel = mongoose.model('DirectoryObject');
	const children = await model.find({ parent: this._id });

	return Object.fromEntries(children.map((child) => [child.name, child]));
});

const DirectoryObject: DirectoryObjectModel =
	mongoose.models.DirectoryObject || mongoose.model('DirectoryObject', directoryObjectSchema);

export default DirectoryObject;
