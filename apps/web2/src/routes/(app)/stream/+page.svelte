<script lang="ts">
	import { stream } from '$lib/services/Entries';
	import { Option } from 'effect';
	import Suspense from './suspense.svelte';
</script>

<Suspense rx={stream}>
	{#snippet fallback()}
		Loading...
	{/snippet}

	{#snippet children({ value })}
		{#each value.arr as item}
			<div>
				<a href="/{item.id}">{item.title.pipe(Option.getOrElse(() => '(no title)'))}</a>
			</div>
		{/each}
	{/snippet}
</Suspense>
