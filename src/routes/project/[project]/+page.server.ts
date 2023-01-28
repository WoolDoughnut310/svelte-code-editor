import Project from '$lib/server/models/Project';
import process from '$lib/server/terminal';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
	const project = await Project.findById(params.project);

	if (!locals.user) {
		throw redirect(307, '/');
	}

	if (!project) {
		throw error(404, 'Not Found');
	}

	console.log('in here');

	return {
		directory: await project.traverse()
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	terminal: async ({ request, locals, params }) => {
		const projectId = params.project as string;

		const project = await Project.findById(projectId);

		if (!project) {
			return fail(404, {
				message: 'project not found'
			});
		}

		if (!locals.terminal) {
			locals.terminal = {
				cwd: '/',
				curr: project.root
			};
		}

		const data = await request.formData();
		const input = data.get('input');

		if (!input || typeof input !== 'string') {
			return fail(400, { message: 'input not provided' });
		}

		const output = await process(project, locals.terminal, input);

		return { output };
	}
};
