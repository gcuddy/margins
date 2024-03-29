import { get, writable } from 'svelte/store';

// TODO: rewrite for svelte 5

type ReplicacheStatus = Record<string, { synced?: boolean }>;

function replicacheStatusStore() {
	const replicacheStatus = writable<ReplicacheStatus>({});

	return {
		...replicacheStatus,
		isSynced: (key: string) => {
			const status = get(replicacheStatus);
			return Boolean(status[key]?.synced);
		},
		markSynced: (key: string) => {
			replicacheStatus.update((status) => {
				status[key] = { synced: true };
				return status;
			});
		},
	};
}

const replicacheStatus = replicacheStatusStore();

export default replicacheStatus;
