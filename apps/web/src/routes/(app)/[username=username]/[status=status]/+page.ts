import { capitalize } from '@margins/lib';

function type(status: string) {
	status = status.toLowerCase();

	if (status === 'done') {
		return 'Archive';
	} else if (status === 'now') {
		return 'Now';
	} else {
		return 'Backlog';
	}
}
export function load({ params }) {
	return {
		status: capitalize(params.status, true),
		statusType: type(params.status),
	};
}
