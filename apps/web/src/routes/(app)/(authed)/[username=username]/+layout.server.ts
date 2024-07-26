import { redirect } from '@sveltejs/kit';

// TODO: make this work without server
export async function load({ locals, params }) {
	console.log('username load');
	const username = params.username.slice(2);
	if (!locals.user || !locals.session) {
		return redirect(302, '/login');
	}

	// TODO: eventually workspaceId will be a thing, but for now we just match on username
	if (locals.user.username !== username) {
		return redirect(302, '/login');
	}

	return {
		session: locals.session,
		user: locals.user as typeof locals.user & { username: string },
	};
}
