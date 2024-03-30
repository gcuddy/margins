import { capitalize } from '@margins/lib';

export function load({ params }) {
	return {
		status: capitalize(params.status, true),
	};
}
