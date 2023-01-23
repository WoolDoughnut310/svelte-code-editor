import type { Server } from 'socket.io';

export default function handler(io: Server) {
	io.on('connection', (socket) => {
		//

		socket.on('change', (change) => {
			console.log('server got change');
			socket.broadcast.emit('change', change);
		});
	});
}
