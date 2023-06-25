import { client, getUser } from '$lib/server/authClient';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async ({ url, locals, cookies }) => {
	const code = url.searchParams.get('code');
	const err = url.searchParams.get('error');

	if (err) throw error(400, err);
	if (!code) throw error(400, 'no code specified');
	const { token } = await client.getToken({
		code,
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		redirect_uri: undefined
	});

	if (token.error) {
		throw error(400, token.error);
	}

	const accessToken = token.access_token;

	// Get the authenticated user
	const user = await getUser(accessToken);
	
	cookies.set("user", JSON.stringify({
		avatar: user.avatar_url,
		username: user.login
	}), {
		path: "/",
		httpOnly: true,
		sameSite: "strict",
		secure: process.env.NODE_ENV === 'production',
		maxAge: 7_200,
	});

	return new Response(null, { status: 307, headers: { location: '/' } });
}) satisfies RequestHandler;
