import { loginRedirect } from '$lib/utils/redirects';
import { superValidate } from 'sveltekit-superforms/server';
import { hypothesisSchema } from './schema';

export async function load(event) {
	const session = await event.locals.auth.validate();

	if (!session) throw loginRedirect(event);

	return {
		form: superValidate(hypothesisSchema),
		title: 'Hypothes.is',
	};
}
