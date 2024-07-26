import { redirect } from '@sveltejs/kit';

export function load({ data }) {
	redirect(302, `/u:${data.user.username}/backlog`);
}
