import { db } from '$lib/db';
import { loginRedirect } from '$lib/utils/redirects';
export async function load(event) {
	const session = await event.locals.auth.validate();
	if (!session) throw loginRedirect(event);
	const views = db
		.selectFrom('SmartList')
		.where('userId', '=', session.user.userId)
		.select(['id', 'name', 'icon'])
		.execute();
	return {
		views,
	};
}
