import Delta from 'quill-delta';
import DirectoryObject from '../models/DirectoryObject';
import Project from '../models/Project';
import process from '../terminal';
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
	});

	io.on('connection', async (socket) => {
		const project = socket.data.project;

		if (!project) {
			return socket.disconnect();
		}

		const projectId = project._id.toString();
		socket.join(projectId);

		const terminal = {
			cwd: '/',
			curr: project.root
		};

		socket.on('terminal', async (data) => {
			// Parse command
			const output = await process(project, terminal, data);
			socket.emit('terminal', output);
		});

		socket.on('change', async (fileId, change) => {
			const fileObject = await DirectoryObject.findById(fileId);

			if (!fileObject || fileObject.content === undefined) {
				return;
			}

			let doc = new Delta(fileObject.content);
			doc = doc.compose(change);

			fileObject.content = doc.ops;

			socket.to(projectId).emit('change', fileId, change);
		});
	});
}
