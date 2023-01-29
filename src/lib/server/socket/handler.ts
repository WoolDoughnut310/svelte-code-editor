import Delta from 'quill-delta';
import Project from '../models/Project';
import type { Server } from './types';

export default function handler(io: Server) {
	io.use(async (socket, next) => {
		const projectId = socket.handshake.auth.projectId;
		const project = await Project.findById(projectId);

		if (!project) {
			const error = new Error('project not found');
			return next(error);
		}

		socket.data.project = project;
		next();
	});

	io.on('connection', async (socket) => {
		const project = socket.data.project;

		if (!project) {
			return socket.disconnect();
		}

		const projectId = project._id.toString();
		socket.join(projectId);

		socket.on('change', async (id, change) => {
			console.log('got change', id, change);
			const file = project.files.id(id);

			if (!file) {
				return;
			}

			let doc = new Delta(file.content);
			doc = doc.compose(change);

			file.content = doc.ops;

			await project.save();

			socket.to(projectId).emit('change', id, change);
		});
	});
}
