import { Project, ProjectClass } from '$lib/server/models';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { EJSON } from 'bson';

export const load = (async ({ params, locals }) => {
	const project = await Project.findById(params.project).lean();
	
	if (!locals.user) {
		return new Response(null, { status: 307, headers: { location: '/' } });
	}

	if (!project) {
		throw error(404, 'not found');
	}

	return {
		project: EJSON.serialize(project) as ProjectClass
	};
}) satisfies PageServerLoad;

export const actions = {
	createFile: async ({ request, params }) => {
		const project = await Project.findById(params.project);
		if (!project) {
			return fail(404, { message: 'not found' });
		}

		const data = await request.formData();
		const filename = data.get('filename');

		if (typeof filename !== 'string') {
			return fail(400, { message: 'invalid filename type' });
		}

		if (project.files.map((file) => file.name).includes(filename)) {
			return fail(400, { filename, message: 'file already exists' });
		}

		project.files.push({ name: filename, content: [] });
		await project.save();
	},
	renameFile: async ({ request, params }) => {
		const project = await Project.findById(params.project);
		if (!project) {
			return fail(404, { message: 'not found' });
		}

		const data = await request.formData();

		const id = data.get('id');
		const value = data.get('value');

		if (!(typeof id === 'string' && typeof value === 'string')) {
			return fail(400, { message: 'invalid id type' });
		}

		const file = project.files.id(id);

		if (!file) {
			return fail(404, { message: 'not found' });
		}

		file.name = value;
		await project.save();
	},
	deleteFile: async ({ request, params }) => {
		const project = await Project.findById(params.project);
		if (!project) {
			return fail(404, { message: 'not found' });
		}

		const data = await request.formData();

		const id = data.get('id');

		if (typeof id !== 'string') {
			return fail(400, { message: 'invalid id type' });
		}

		project.files.id(id)?.remove();
		await project.save();
	}
} satisfies Actions;
