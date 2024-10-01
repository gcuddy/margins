<script lang="ts">
	import { stream, get } from '$lib/services/Entries';
	import { Option } from 'effect';
	import { useRx, useRxSet, useRxValue } from '../profile/rx.svelte';

	const streamed = useRxValue(stream);
</script>

{#if streamed._tag === 'Success'}
	{#each streamed.value.arr as item}
		<div>
			<a href="/{item.id}">{item.title}</a>
		</div>
	{/each}
{/if}
