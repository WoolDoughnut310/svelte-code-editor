import { ObjectId } from 'mongodb';
import mongoose, { type InferSchemaType } from 'mongoose';
import Delta, { Op } from 'quill-delta';
const { Schema } = mongoose;

const directoryObjectSchema = new Schema(
	{
		type: { type: String, enum: ['file', 'folder'] },
		parent: {
			type: ObjectId,
			ref: 'DirectoryObject'
		},
		name: { type: String, required: true, trim: true },
		content: {
			type: Object,
			get: (data?: Op[] | { ops: Op[] }) => new Delta(data)
		}
	},
	{
		methods: {
			findChildren(cb) {
				return mongoose.model('DirectoryObject').find({ parent: this._id }, cb);
			}
		}
	}
);

export type DirectoryObject = InferSchemaType<typeof directoryObjectSchema>;

export default mongoose.models.DirectoryObject ||
	mongoose.model('DirectoryObject', directoryObjectSchema);
