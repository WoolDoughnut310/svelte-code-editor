import { Project } from '$lib/server/models';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { browser } from '$app/environment';
import {goto} from "$app/navigation";

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
		
		return { id: project._id.toString() };
	}
} satisfies Actions;
