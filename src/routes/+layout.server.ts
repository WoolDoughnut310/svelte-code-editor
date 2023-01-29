import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	return {
		session: {
			user: locals.user
		}
	};
}) satisfies LayoutServerLoad;
