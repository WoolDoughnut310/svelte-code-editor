import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
console.log("the locals are", locals);
	return {
		session: {
			user: locals.user
		}
	};
}) satisfies LayoutServerLoad;
