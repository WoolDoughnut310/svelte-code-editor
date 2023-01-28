/* eslint-disable @typescript-eslint/ban-types */
import type Delta from 'quill-delta';
import type { Server as IOServer, Socket as IOSocket } from 'socket.io';
import type { ProjectDocument } from '../models/Project';

export interface ServerToClientEvents {
	change: (fileId: string, delta: Delta) => void;
	terminal: (data: string) => void;
}

export interface ClientToServerEvents {
	change: (fileId: string, delta: Delta) => void;
	terminal: (data: string) => void;
}

export interface SocketData {
	project: ProjectDocument;
}

export type Server = IOServer<ServerToClientEvents, ClientToServerEvents, {}, SocketData>;
export type Socket = IOSocket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>;
