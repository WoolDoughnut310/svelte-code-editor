/* eslint-disable @typescript-eslint/ban-types */
import type Delta from 'quill-delta';
import type { Server as IOServer } from 'socket.io';
import type { IProjectDocumentTypes, ProjectDocument } from '../models/Project';
import type { Socket as IOSocket } from 'socket.io-client';

export interface ServerToClientEvents {
	change: (id: string, delta: Delta) => void;
	terminal: (data: string) => void;
	cwd: (dir: string) => void;
	open: (file: IProjectDocumentTypes['files'][0], dir: string) => void;
}

export interface ClientToServerEvents {
	change: (id: string, delta: Delta) => void;
	terminal: (data: string) => void;
}

export interface SocketData {
	project: ProjectDocument;
}

export type Server = IOServer<ClientToServerEvents, ServerToClientEvents, {}, SocketData>;
export type Client = IOSocket<ServerToClientEvents, ClientToServerEvents>;
