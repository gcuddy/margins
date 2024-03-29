import type { User } from 'lucia';

export function redirectToUser(user: Pick<User, 'username'>) {
	if (user.username) {
		return `/u:${user.username}`;
	} else {
		return '/username';
	}
}
