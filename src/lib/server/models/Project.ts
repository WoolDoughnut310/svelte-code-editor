/* eslint-disable @typescript-eslint/ban-types */
import mongoose, { Model, type HydratedDocument } from 'mongoose';
const { Schema } = mongoose;
import DirectoryObject, { type DirectoryObjectDocument } from './DirectoryObject';

export interface IProject {
	creator: string;
	name: string;
}

interface IProjectVirtuals {
	root: DirectoryObjectDocument;
}

export type ProjectDocument = HydratedDocument<IProject, IProjectMethods, IProjectVirtuals>;

interface IProjectMethods {
	traverse(): ReturnType<typeof traverse>;
}

type Directory = DirectoryObjectDocument | DirectoryObjectDocument[] | Directory[];

export type ProjectModel = Model<IProject, {}, IProjectMethods, IProjectVirtuals>;

const projectSchema = new Schema<IProject, ProjectModel, IProjectMethods, {}, IProjectVirtuals>(
	{
		creator: { type: String, required: true },
		name: { type: String, required: true, lowercase: true, trim: true }
	},
	{
		bufferCommands: false,
		timestamps: true
	}
);

projectSchema.virtual('root').get(function () {
	return new DirectoryObject({ _id: this._id, type: 'folder' });
});

projectSchema.method('traverse', async function () {
	// Mimic a folder object to get directory
	const root = new DirectoryObject({ _id: this._id, type: 'folder' });

	return traverse(root);
});

// Recursive function, returns a file's document or a
// folder's document with `desc`, containing a mapping
// of name to object, or folder
async function traverse(
	obj: DirectoryObjectDocument
): Promise<DirectoryObjectDocument | (DirectoryObjectDocument & { desc: Directory })> {
	if (obj.type === 'file') {
		return obj;
	}

	const children = await obj.findChildren();

	const folder = await Promise.all(
		Object.entries(children).map(async ([name, child]) => {
			const desc = await traverse(child);
			return [
				name,
				{
					...child,
					desc
				}
			];
		})
	);

	return Object.fromEntries(folder);
}

const Project: ProjectModel = mongoose.models.Project || mongoose.model('Project', projectSchema);

export default Project;
