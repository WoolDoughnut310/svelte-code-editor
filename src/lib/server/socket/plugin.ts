import { Server } from 'socket.io';
import type { PluginOption } from 'vite';
import handler from '../handler';

const plugin: PluginOption = {
	name: 'sveltekit-socket-io',
	configureServer: (server) => {
		if (!server.httpServer) return;

		const io = new Server(server.httpServer);

		handler(io);
	}
};

export default plugin;
