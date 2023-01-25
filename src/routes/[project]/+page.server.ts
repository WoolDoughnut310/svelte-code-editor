import Project from '$lib/server/models/Project';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const project = await Project.findById(params.project);

	if (!project) {
		throw error(404, "Not Found");
	}

	return {
		directory: await project.traverse()
	};
}) satisfies PageServerLoad;
