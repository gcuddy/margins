<script lang="ts">
	import { Pool } from '$lib/worker/client';
	import { Effect } from 'effect';
	import { Search } from '$lib/worker/schema';
	import { runtime } from '$lib/runtime';
	import EntryListItem from '$lib/components/entry-list-item.svelte';
	import { Highlight } from '@orama/highlight';

	let { data } = $props();
	// let search = $state('');

	const searchEffect = (q: string) =>
		Pool.pipe(Effect.flatMap((pool) => pool.executeEffect(new Search({ q }))));

	const highlighter = new Highlight({
		HTMLTag: 'span',
		CSSClass: 'entry-list-item-highlight'
	});

	const promise = $derived(runtime.runPromise(searchEffect(data.q)));

</script>

<!-- <input type="text" placeholder="Search" bind:value={search} /> -->

{#await promise}
	loading...
{:then results}
	{results.count} results
	<div class="flex flex-col">
		{#each results.hits as hit (hit.id)}
			<EntryListItem
				title={hit.document.title ?? ''}
				author={hit.document.author ?? ''}
				imageSrc={hit.document.image ?? ''}
				href={`/${hit.id}`}
			>
				{#snippet titleSnippet()}
					{@const highlighted = highlighter.highlight(hit.document.title ?? '', data.q)}
					{@html highlighted.HTML}
				{/snippet}
				{#snippet authorSnippet()}
					{@const highlighted = highlighter.highlight(hit.document.author ?? '', data.q)}
					{@html highlighted.HTML}
				{/snippet}

				{#snippet bodySnippet()}
					{@const highlighted = highlighter.highlight(hit.document.text ?? '', data.q)}
					{#if highlighted.positions.length}
						{@html highlighted.trim(100)}
					{/if}
				{/snippet}
			</EntryListItem>
		{/each}
	</div>
{:catch error}
	{JSON.stringify(error)}
{/await}
