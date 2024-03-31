import type { Replicache } from 'replicache';
import { getContext, setContext } from 'svelte';
import type { Client } from './index.js';
import type { ServerType } from './server.js';

const s = Symbol('replicache');

export type ReplicacheType = Replicache<
	ReturnType<Client<ServerType>['build']>
>;

export function getReplicache() {
	const replicache = getContext(s);

	if (!replicache) {
		throw new Error('Replicache not found');
	}

	return replicache as ReplicacheType;
}

export function setReplicache(replicache: Replicache) {
	setContext(s, replicache);
}
