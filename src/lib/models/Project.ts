import mongoose, { Model, type HydratedDocument } from 'mongoose';
const { Schema } = mongoose;
import type { DirectoryObjectDocument } from './DirectoryObject';

export interface IProject {
	creator: string;
	name: string;
}

export type ProjectDocument = HydratedDocument<IProject, IProjectMethods>;

export interface IProjectMethods {
	traverseFiles(): Promise<Directory>;
}

type Directory = DirectoryObjectDocument | DirectoryObjectDocument[] | Directory[];

// eslint-disable-next-line @typescript-eslint/ban-types
export type ProjectModel = Model<IProject, {}, IProjectMethods>;

const projectSchema = new Schema<IProject, ProjectModel, IProjectMethods>({
	creator: { type: String, required: true },
	name: { type: String, required: true, lowercase: true, trim: true }
});

projectSchema.method('traverseFiles', async function () {
	const model = mongoose.model('DirectoryObject');

	// Get top-level directory objects
	const rootObjects = await model.find().exists('project', false).exec();

	const directory = await Promise.all(
		rootObjects.map((child) => {
			return traverse(child);
		})
	);

	return directory;
});

async function traverse(obj: DirectoryObjectDocument): Promise<Directory> {
	if (obj.type === 'file') {
		return obj;
	}

	const children = await obj.findChildren();

	const folder = await Promise.all(
		children.map((child) => {
			return traverse(child);
		})
	);

	return folder;
}

const model: ProjectModel = mongoose.models.Project || mongoose.model('Project', projectSchema);

export default model;
