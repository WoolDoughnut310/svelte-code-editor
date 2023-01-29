import mongoose from 'mongoose';
const { Schema } = mongoose;
import load from 'dotenv';
load.config();

await mongoose.connect(process.env.MONGODB_URI);

const projectSchema = new Schema(
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

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

export default Project;
