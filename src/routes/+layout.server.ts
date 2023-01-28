import { getSession } from '../hooks.server';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const session = getSession({ locals });
	return {
		session
	};
}) satisfies LayoutServerLoad;
