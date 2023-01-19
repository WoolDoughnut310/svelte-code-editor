import type { Server } from 'socket.io';

export default function handler(io: Server) {
	io.on('connection', (socket) => {
		//
	});
}
