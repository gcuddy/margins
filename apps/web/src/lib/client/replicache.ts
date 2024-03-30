import { Replicache } from 'replicache';
import replicacheStatus from './stores/replicache-status';
import { getContext, setContext } from 'svelte';
import { Client } from '@margins/features';
import type { ServerType } from '@margins/features/replicache/server';

const s = Symbol('replicache');

const mutators = new Client<ServerType>()
	.mutation('bookmark_create', async (tx, input) => {
		console.log('bookmark_create', input);
	})
	.build();

export function createReplicache({
	token,
	workspaceID,
}: {
	token: string;
	workspaceID: string;
}) {
	const replicache = new Replicache({
		auth: `Bearer ${token}`,
		indexes: {
			id: {
				allowEmpty: true,
				jsonPointer: '/id',
			},
		},
		licenseKey: 'ld43a69e6baa14a1a85eb6bb09661739e',
		mutators,
		name: workspaceID,
		// higher speed for testing
		pullInterval: 1000 * 60,

		// TODO: web socket
		pullURL: '/replicache/pull',
		pushURL: '/replicache/push',
	});

	replicache.onSync = (s) => {
		if (!s) replicacheStatus.markSynced(replicache.name);
	};

	// replicache.puller = async (req) => {

	// }

	return replicache;
}

export function updateReplicache(cb?: (replicache: ReplicacheType) => void) {
	const rep = getReplicache();

	if (cb) {
		cb(rep);
	}

	rep.pull();
}

export type ReplicacheType = ReturnType<typeof createReplicache>;

export function getReplicache() {
	const replicache = getContext(s);

	if (!replicache) {
		throw new Error('Replicache not found');
	}

	// TODO actual typings lol
	return replicache as ReplicacheType;
}

export function setReplicache(replicache: Replicache) {
	setContext(s, replicache);
}
