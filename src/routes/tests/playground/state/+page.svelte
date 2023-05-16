<script lang="ts">
	import { create_state } from '$lib/state';

	export let data;
	const state = data.state;
    console.log({$state})
	//     const state = create_state("entries_by_tag", {
	//         name: "favorites"
	//     })

	// $: console.log({$state})
</script>

{JSON.stringify($state)}

{#if $state.loading}
	<p>Loading...</p>
{:else if $state.data}
	{#each $state.data.entries as entry}
		<p>{entry.title}</p>
	{/each}
{/if}
