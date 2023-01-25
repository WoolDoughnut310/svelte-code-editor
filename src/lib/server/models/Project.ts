import mongoose, { Model, type HydratedDocument } from 'mongoose';
const { Schema } = mongoose;
import DirectoryObject, { type DirectoryObjectDocument } from './DirectoryObject';

export interface IProject {
	creator: string;
	name: string;
}

export type ProjectDocument = HydratedDocument<IProject, IProjectMethods>;

export interface IProjectMethods {
	traverse(): ReturnType<typeof traverse>;
}

type Directory = DirectoryObjectDocument | DirectoryObjectDocument[] | Directory[];

// eslint-disable-next-line @typescript-eslint/ban-types
export type ProjectModel = Model<IProject, {}, IProjectMethods>;

const projectSchema = new Schema<IProject, ProjectModel, IProjectMethods>({
	creator: { type: String, required: true },
	name: { type: String, required: true, lowercase: true, trim: true }
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
