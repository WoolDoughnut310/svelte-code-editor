/* eslint-disable @typescript-eslint/ban-types */
import type Delta from 'quill-delta';
import type { Server as IOServer } from 'socket.io';
import type { ProjectClass } from '../models';
import type { Socket as IOSocket } from 'socket.io-client';
import type { DocumentType } from '@typegoose/typegoose';

type User = ProjectClass['creator'];

export interface ServerToClientEvents {
	change: (id: string, delta: Delta) => void;
	users: (users: User[]) => void;
	join: (user: User) => void;
	leave: (username: string) => void;
}

export interface ClientToServerEvents {
	change: (id: string, delta: Delta) => void;
}

export interface SocketData {
	project: DocumentType<ProjectClass>;
	user: User;
}

export type Server = IOServer<ClientToServerEvents, ServerToClientEvents, {}, SocketData>;
export type Client = IOSocket<ServerToClientEvents, ClientToServerEvents>;
