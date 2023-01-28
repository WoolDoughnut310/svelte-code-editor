import Project from '$lib/server/models/Project';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	create: async ({ request, locals }) => {
		const data = await request.formData();
		const value = data.get('value');
		console.log("creating", value)

		const project = new Project({
			creator: locals.user.username,
			name: value
		});

		await project.save();
		console.log(project.toJSON())

		throw redirect(303, `/${project._id}`);
	},
	join: async ({ request }) => {
		const data = await request.formData();
		const value = data.get('value');

		throw redirect(303, `/${value}`);
	}
} satisfies Actions;
