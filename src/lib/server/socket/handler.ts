import Delta from 'quill-delta';
import { Project } from '../models';
import type { Server } from './types';

export default function handler(io: Server) {
	io.use(async (socket, next) => {
		const user = socket.handshake.auth.user;
		const projectId = socket.handshake.auth.projectId;
		const project = await Project.findById(projectId);

		if (!project) {
			const error = new Error('project not found');
			return next(error);
		}

		socket.data.project = project;
		socket.data.user = user;
		next();
	});

	io.on('connection', async (socket) => {
		const project = socket.data.project;
		const user = socket.data.user;

		if (!project || !user) {
			return socket.disconnect();
		}

		const projectId = project._id.toString();
		socket.join(projectId);

		const otherSockets = await io.in(projectId).fetchSockets();
		const users = otherSockets.map((socket) => socket.data.user);

		socket.emit('users', users);
		socket.to(projectId).emit('join', user);
		socket.to(projectId).emit("please");

		socket.on('change', async (filename, change) => {
			const file = project.files.find((file) => file.name === filename);

			if (!file) {
				return;
			}

			let doc = new Delta(file.content);
			doc = doc.compose(change);

			file.content = doc.ops;

			await project.save();

			socket.to(projectId).emit('change', filename, change);
		});

		socket.on('disconnect', () => {
			socket.to(projectId).emit('leave', user.username);
		});
	});
}
