import { nanoid } from '$lib/nanoid';
import { redirect } from '@sveltejs/kit';

export function load() {
	// just redirect to an id we create
	throw redirect(302, `/note/${nanoid()}`);
}
