import { client } from '$lib/server/authClient';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const authUrl = client.authorizeURL({
	redirect_uri:
		'https://wooldoughnut310-legendary-fiesta-rpr54pvq664cxxx7-5174.preview.app.github.dev/auth/redirect'
});

export const GET = (() => {
	console.log(authUrl)
	// throw redirect(302, authUrl);
	return new Response({

	}, {
		headers: {Location: "https://www.google.com"},
		status: 302
	})
}) satisfies RequestHandler;
