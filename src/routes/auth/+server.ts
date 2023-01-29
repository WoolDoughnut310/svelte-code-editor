import { client } from '$lib/server/authClient';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const authUrl = client.authorizeURL({
	redirect_uri: 'http://127.0.0.1:5173/auth/redirect'
});

export const GET = (() => {
	console.log(authUrl);
	throw redirect(302, authUrl);
}) satisfies RequestHandler;
