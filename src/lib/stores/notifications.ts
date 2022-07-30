import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import type { StoredComponent, SvelteComponentWithProps } from './types';

export interface INotification {
	message: string | StoredComponent;
	title?: string;
	link?: {
		href: string;
		text: string;
	};
	id: string;
	timeout: number;
	type: 'info' | 'success' | 'error';
	onClick?: () => void;
}

function getDefaultNotificationData(): Omit<INotification, 'message'> {
	const id = uuidv4();
	return {
		id,
		timeout: 8500,
		type: 'info',
		onClick: () => notifications.remove(id)
	};
}

type NotificationParam = Pick<INotification, 'message'> & Partial<INotification>;

function notificationStore() {
	const { subscribe, update } = writable<INotification[]>([]);
	const notify = <T>(
		notification: {
			message: string | SvelteComponentWithProps<T>;
		} & Partial<INotification>
	) =>
		update((val) => {
			const newNotification = Object.assign(getDefaultNotificationData(), notification);
			const newVal = [...val, newNotification];
			setTimeout(() => {
				remove(newNotification.id);
			}, newNotification.timeout);
			return newVal;
		});
	const remove = (id: string) => {
		update((val) => val.filter((n) => n.id !== id));
	};
	const pause = (id: string) => {
		update((val) => val.map((n) => (n.id === id ? { ...n, timeout: 0 } : n)));
	};
	return {
		subscribe,
		notify,
		remove
	};
}
export const notifications = notificationStore();
