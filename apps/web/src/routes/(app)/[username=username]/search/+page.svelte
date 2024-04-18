<script lang="ts">
	import { getReplicache } from '@margins/features/replicache';
	import { ShellHeader } from '@margins/features/shell';
	import { createDerivedLibrarySearchStore } from '@margins/features/data';

	// TODO: bind with url state
	//
	// TODO: this should come higher up in state to prevent it being recreated each time.
	//
	const rep = getReplicache();
	const { input, results } = createDerivedLibrarySearchStore(rep);

	rep.subscribe(
		(tx) => {
			return tx.scan().entries().toArray();
		},
		(s) => console.log(s),
	);
</script>

<ShellHeader>
	<input bind:value={$input} type="text" class="h-full w-full grow" />
</ShellHeader>

{JSON.stringify($results)}
