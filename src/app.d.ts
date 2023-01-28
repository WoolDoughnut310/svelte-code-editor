// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { DirectoryObjectDocument } from '$lib/server/models/DirectoryObject';

// and what to do when importing types
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			terminal: {
				cwd: string;
				curr: DirectoryObjectDocument;
			};
			user: { [key: string]: string };
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
