import { Replicache } from 'replicache';
import replicacheStatus from './stores/replicache-status';
import { Client } from '@margins/features';
import type { ServerType } from '@margins/features/replicache/server';
import { AnnotationStore, LibraryStore } from '@margins/features/data';

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
	.mutation('annotation_create', async (tx, input) => {
		await AnnotationStore.put(tx, [input.id!], {
			...input,
		});
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
