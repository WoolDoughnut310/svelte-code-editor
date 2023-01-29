import mongoose, {
	Model,
	Types,
	type HydratedDocument,
	type LeanDocument,
	type ObjectId
} from 'mongoose';
import type { Op } from 'quill-delta';
const { Schema } = mongoose;

export interface IFile {
	_id: Types.ObjectId;
	name: string;
	content: Op[];
}

export interface IProject {
	creator: string;
	name: string;
	files: IFile[];
}

export interface IProjectDocumentTypes {
	files: Types.DocumentArray<IFile>;
}

export type ProjectDocument = HydratedDocument<IProject, IProjectDocumentTypes>;
export type LeanProjectDocument = LeanDocument<IProject & { _id: ObjectId }>;
export type ProjectModel = Model<IProject, unknown, IProjectDocumentTypes>;

const projectSchema = new Schema<IProject, ProjectModel>(
	{
		creator: { type: String, required: true },
		name: { type: String, required: true, lowercase: true, trim: true },
		files: [
			{
				name: { type: String, required: true, trim: true },
				content: [Object]
			}
		]
	},
	{
		timestamps: true
	}
);

const Project: ProjectModel = mongoose.models.Project || mongoose.model('Project', projectSchema);

export default Project;
