import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import socketio from './src/lib/server/socket/plugin';

const config: UserConfig = {
	plugins: [sveltekit(), socketio]
};

export default config;
