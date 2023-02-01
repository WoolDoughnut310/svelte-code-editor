import { derived } from 'svelte/store';
import type { ProjectClass } from '$lib/server/models';
import { page } from '$app/stores';
import { EJSON } from 'bson';

export const project = derived<typeof page, ProjectClass>(
	page,
	($page) => EJSON.deserialize($page.data.project) as ProjectClass
);
