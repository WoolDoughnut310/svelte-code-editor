import { invalidate } from '$app/navigation';
import dbConnect from '$lib/server/dbConnect';
import type { Handle } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

await dbConnect();

export async function getSession({ locals }: RequestEvent) {
	if (locals.user) {
		return { user: locals.user };
	}
	return {};
}

export const handle = (async ({ event, resolve }) => {
	console.log(event.route);
	const loggingOut = event.route.id === '/api/logout.json';

	const userString = event.cookies.get('user');

	event.locals.user = userString && JSON.parse(userString);

	const response = await resolve(event);

	const user = loggingOut ? '' : JSON.stringify(event.locals.user);

	const secure = process.env.NODE_ENV === 'production';
	const maxAge = 7_200; // (3600 seconds / hour) * 2 hours
	const sameSite = 'Strict';
	const cookieHeader = `user=${user || ''}; Max-Age=${maxAge}; Path=/; ${
		secure ? 'Secure;' : ''
	} HttpOnly; SameSite=${sameSite}`;
	response.headers.set('Set-Cookie', cookieHeader);

	return response;
}) satisfies Handle;
