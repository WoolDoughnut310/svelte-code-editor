import type { Types } from 'mongoose';
import {
	getModelForClass,
	prop,
	type DocumentType,
	defaultClasses,
	PropType
} from '@typegoose/typegoose';

export class FileClass {
	@prop({ required: true, type: () => String })
	public name!: string;

	@prop({ type: () => [Object] })
	public content!: { [key: string]: unknown }[];
}

export class User {
	@prop({ type: String, required: true })
	public username!: string;
	@prop({ type: String })
	public avatar?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProjectClass extends defaultClasses.Base {}
export class ProjectClass {
	@prop({ required: true, type: () => User })
	public creator!: User;

	@prop({ required: true, type: String })
	public name!: string;

	@prop({ type: () => [FileClass], required: true }, PropType.ARRAY)
	public files!: Types.DocumentArray<DocumentType<FileClass>>;
}

export const Project = getModelForClass(ProjectClass);
