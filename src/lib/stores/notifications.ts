import { writable } from "svelte/store";
import { v4 as uuidv4 } from "uuid";

import type { IconName } from "$lib/icons";
import type { ChosenIcon } from "$lib/types/icon";

import type { StoredComponent, SvelteComponentWithProps } from "./types";

export interface INotification {
	message?: string | StoredComponent;
	title?: string;
	link?: {
		href: string;
		text: string;
	};
	id: string;
	timeout: number;
	icon?: IconName | ChosenIcon;
	type: "info" | "success" | "error";
	onClick?: () => void;
}

function getDefaultNotificationData(id?: string): Omit<INotification, "message"> {
	if (!id) {
		id = uuidv4();
	}
	return {
		id,
		timeout: 5000,
		type: "info",
		onClick: () => notifications.remove(id as string),
	};
}

type NotificationParam = Pick<INotification, "message"> & Partial<INotification>;

function notificationStore() {
	const { subscribe, update } = writable<INotification[]>([]);
	const notify = <T>(
		notification: {
			message?: string | SvelteComponentWithProps<T>;
		} & Partial<INotification>
	) => {
		const id = uuidv4();
		update((val) => {
			const newNotification = Object.assign(getDefaultNotificationData(id), notification);
			const newVal = [...val, newNotification];
			setTimeout(() => {
				remove(newNotification.id);
			}, newNotification.timeout);
			return newVal;
		});
		return id;
	};
	const modify = (id: string, notification: Partial<INotification>) => {
		update((val) => {
			const newVal = val.map((n) => {
				if (n.id === id) {
					return { ...n, ...notification };
				}
				return n;
			});
			return newVal;
		});
	};

	const remove = (id: string) => {
		update((val) => val.filter((n) => n.id !== id));
	};
	const pause = (id: string) => {
		update((val) => val.map((n) => (n.id === id ? { ...n, timeout: 0 } : n)));
	};
	return {
		subscribe,
		notify,
		remove,
		modify,
	};
}
export const notifications = notificationStore();
