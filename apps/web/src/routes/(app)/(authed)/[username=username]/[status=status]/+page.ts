import type { Status } from '@margins/db/kysely/enums';
import { capitalize } from '@margins/lib';

function type(status: string): Status {
	status = status.toLowerCase();

	if (status === 'archive') {
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
