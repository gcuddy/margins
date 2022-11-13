import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';
import { type User, user as userStore, user_data_dirty } from '$lib/stores/user';

export const load: LayoutLoad = async ({ data }) => {
	if (browser) {
		userStore.set({ ...data } as User);
		return {
			user: userStore,
		};
	}
};
