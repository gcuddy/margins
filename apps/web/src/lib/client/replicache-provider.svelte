<script lang="ts">
	import { onDestroy } from 'svelte';
	import { createReplicache, setReplicache } from './replicache';

	export let workspaceID: string;
	export let token: string;

	// this could also happen in load function?
	const rep = createReplicache({
		token,
		workspaceID,
	});

	setReplicache(rep);

	// TODO: poke handler

	onDestroy(() => {
		rep.close();
	});

	// const init = createGet(
	// 	() => '/init',
	// 	() => rep,
	// )();
</script>

<svelte:window on:focus={() => rep.pull} />

{#if rep}
	<slot />
{:else}
	Loading...
{/if}
