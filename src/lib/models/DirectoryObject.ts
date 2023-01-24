import { ObjectId } from 'mongodb';
import mongoose, { Model, type HydratedDocument } from 'mongoose';
import Delta, { Op } from 'quill-delta';
const { Schema } = mongoose;

export interface IDirectoryObject {
	type: 'file' | 'folder';
	parent: ObjectId;
	name: string;
	content?: Op[] | { ops: Op[] };
	fileId?: string;
}

export type DirectoryObjectDocument = HydratedDocument<IDirectoryObject, IDirectoryObjectMethods>;

export interface IDirectoryObjectMethods {
	findChildren(): Promise<DirectoryObjectDocument[]>;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type DirectoryObjectModel = Model<IDirectoryObject, {}, IDirectoryObjectMethods>;

const directoryObjectSchema = new Schema<
	IDirectoryObject,
	DirectoryObjectModel,
	IDirectoryObjectMethods
>({
	type: { type: String, enum: ['file', 'folder'] },
	parent: {
		type: ObjectId,
		ref: 'DirectoryObject'
	},
	name: { type: String, required: true, trim: true },
	content: {
		type: Object,
		get: (data?: Op[] | { ops: Op[] }) => new Delta(data)
	},
	fileId: {
		type: ObjectId,
		ref: 'files'
	}
});

directoryObjectSchema.method('findChildren', function findChildren() {
	return mongoose.model<IDirectoryObject>('DirectoryObject').find({ parent: this._id }).exec();
});

const model: DirectoryObjectModel =
	mongoose.models.DirectoryObject || mongoose.model('DirectoryObject', directoryObjectSchema);

export default model;
