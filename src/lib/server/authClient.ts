import { AuthorizationCode } from 'simple-oauth2';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';

export const client = new AuthorizationCode({
	client: {
		id: GITHUB_CLIENT_ID,
		secret: GITHUB_CLIENT_SECRET
	},
	auth: {
		tokenHost: 'https://github.com',
		tokenPath: '/login/oauth/access_token',
		authorizePath: '/login/oauth/authorize'
	}
});

export const getUser = async (accessToken: string) => {
	const res = await fetch('https://api.github.com/user', {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
	const data = await res.json();
	return data;
};
