import { Project } from '$lib/server/models';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	create: async ({ request, locals }) => {
		const data = await request.formData();
		const value = data.get('value');

		const project = new Project({
			creator: locals.user,
			name: value,
			files: []
		});

		await project.save();

		throw redirect(303, `/project/${project._id}`);
	},
	join: async ({ request }) => {
		const data = await request.formData();
		const value = data.get('value');

		throw redirect(303, `/project/${value}`);
	}
} satisfies Actions;
