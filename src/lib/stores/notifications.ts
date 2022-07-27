import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

export interface INotification {
	message: string;
	id: string;
	timeout: number;
	type: 'info' | 'success' | 'error';
	onClick?: () => void;
}

function getDefaultNotificationData(): Omit<INotification, 'message'> {
	const id = uuidv4();
	return {
		id,
		timeout: 3000,
		type: 'info',
		onClick: () => notifications.remove(id)
	};
}

type NotificationParam = Pick<INotification, 'message'> & Partial<INotification>;

function notificationStore() {
	const { subscribe, update } = writable<INotification[]>([]);
	const notify = (notification: NotificationParam) =>
		update((val) => {
			const newNotification = Object.assign(getDefaultNotificationData(), notification);
			console.log({ newNotification });
			const newVal = [...val, newNotification];
			setTimeout(() => {
				remove(newNotification.id);
			}, newNotification.timeout);
			return newVal;
		});
	const remove = (id: string) => {
		update((val) => val.filter((n) => n.id !== id));
	};
	return {
		subscribe,
		notify,
		remove
	};
}
export const notifications = notificationStore();
