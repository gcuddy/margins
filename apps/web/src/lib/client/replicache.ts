import { Replicache } from 'replicache';
import replicacheStatus from './stores/replicache-status';
import { Client } from '@margins/features';
import type { ServerType } from '@margins/features/replicache/server';
import {
	AnnotationStore,
	LibraryStore,
	PinStore,
	type PinType,
} from '@margins/features/data';

export { getReplicache, setReplicache } from '@margins/features/replicache';

const mutators = new Client<ServerType>()
	.mutation('bookmark_create', async (tx, input) => {
		// TODO: should we first fetch articleInfo?
		// TODO: toast
		// TODO: if no internet connection, don't put (but queue for later)
		console.log('bookmark_create', input);
		if (navigator.onLine) {
			await LibraryStore.put(tx, [input.id!], {
				id: input.id!,
				...input,
				author: '[no author]',
				title: '[no title]',
				uri: input.uri,
			});
		} else {
			// toast...
		}
	})
	.mutation('bookmark_update', async (tx, { id, input }) => {
		await LibraryStore.update(tx, id, (b) => ({
			...b,
			...input,
		}));
	})
	.mutation('annotation_create', async (tx, input) => {
		await AnnotationStore.put(tx, [input.id!], {
			...input,
		});
	})
	.mutation('pin_create', async (tx, input) => {
		const id: [PinType, string] | undefined = input.entryId
			? ['Entry', input.entryId]
			: undefined;
		if (!id) return;
		await PinStore.put(tx, id, {
			...input,
		});
	})
	.mutation('pin_remove', async (tx, { id }) => {
		await PinStore.remove(tx, id);
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
		// TODO: new license key and actually hide it lol
		licenseKey: 'ld43a69e6baa14a1a85eb6bb09661739e',
		mutators,
		name: workspaceID,
		// higher speed for testing
		// pullInterval: 1000 * 60,

		// TODO: web socket
		pullURL: '/replicache/pull',
		pushURL: '/replicache/push',
	});

	replicache.onSync = (s) => {
		if (!s) replicacheStatus.markSynced(replicache.name);
	};

	return replicache;
}
