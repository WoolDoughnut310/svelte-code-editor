import dbConnect from '$lib/server/dbConnect';
import type { RequestEvent } from './$types';
import type { Handle } from '@sveltejs/kit';

await dbConnect();

export async function getSession({ locals }: RequestEvent) {
	if (locals.user) {
		return { user: locals.user };
	}
	return {};
}

export const handle = (async ({ event, resolve }) => {
	//const loggingOut = event.route.id === '/logout';

	const userString = event.cookies.get('user');

	event.locals.user = userString && JSON.parse(userString);

//console.log("1234");
	return await resolve(event);
}) satisfies Handle;

import type { HandleServerError } from '@sveltejs/kit';
 
 
export const handleError = (({ error, event }) => {
	console.log("there is an error", error);
console.log("the event", event);
 
  return {
    message: 'Whoops!',
  };
}) satisfies HandleServerError;