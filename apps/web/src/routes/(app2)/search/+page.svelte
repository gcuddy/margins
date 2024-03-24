<script lang="ts">
	import { navigating, page } from '$app/stores';
	import ItemArtwork from '$lib/components/ItemArtwork.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/Label.svelte';
	import * as Tabs from '$components/ui/tabs';
	export let data;

	import { MagnifyingGlass } from 'radix-icons-svelte';
	import { Loader2 } from 'lucide-svelte';

	const tabs = [
		{
			name: 'Library',
			href: 'my',
		},
		{
			name: 'Notebook',
			href: 'notes',
		},
		{
			name: 'Movies + TV',
			href: 'movies',
		},
		{
			name: 'Books',
			href: 'books',
		},
		{
			name: 'Podcasts',
			href: 'podcasts',
		},
		{
			name: 'Music',
			href: 'music',
		},
	];
	let q = data.q ?? '';
	// $: q = $page.url.searchParams.get("q") ?? "";
	$: tab = $page.url.searchParams.get('type');

	import Header from '$components/ui/Header.svelte';
	import { derived } from 'svelte/store';
	import { goto } from '$app/navigation';
	import AnnotationCard from '$components/annotations/annotation-card.svelte';
	import { make_link } from '$lib/utils/entries';

	// /search..
	const path = $page.url.pathname;

	const searching = derived(navigating, ($navigating) => {
		return (
			$navigating?.to?.url.pathname === path &&
			$navigating.to?.url.searchParams.has('q')
		);
	});
</script>

<Header>
	<form data-sveltekit-keepfocus class="relative flex grow">
		<input type="hidden" name="type" value={tab} />
		<Label for="search" class="sr-only">Search</Label>
		<span class="absolute left-2 top-1/2 -translate-y-1/2">
			<svelte:component
				this={$searching ? Loader2 : MagnifyingGlass}
				class="h-4 w-4 shrink-0 text-muted-foreground {$searching
					? 'animate-spin'
					: ''}"
			/>
		</span>
		<Input
			autofocus
			class="bg-card pl-8 text-card-foreground"
			bind:value={q}
			id="search"
			name="q"
			placeholder="search"
		/>
	</form>
</Header>

<div class="overflow-hidden border-b py-3 pl-6 pr-9">
	<div class="overflow-auto">
		<Tabs.Root
			value={tab ?? undefined}
			onValueChange={(value) => {
				goto(`?type=${value}${q ? `&q=${q}` : ''}`);
			}}
		>
			<Tabs.List>
				{#each tabs as { name, href }}
					<Tabs.Trigger value={href}>
						{name}
					</Tabs.Trigger>
				{/each}
			</Tabs.List>
		</Tabs.Root>
	</div>
</div>

<div
	class=" mt-4 grid grid-cols-2 gap-6 px-2 pb-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
>
	{#key data.results}
		{#if data.notes}
			{#each data.notes || [] as note}
				<AnnotationCard
					entry={note.entry ? note.entry : undefined}
					hrefPrefix={make_link(note.entry)}
					class="min-w-full"
					annotation={note}
				/>
				<!-- <Annotation class="col-span-2" annotation={note} /> -->
			{/each}
		{:else}
			{#each data.results || [] as result}
				<ItemArtwork showType={tab === 'my'} {q} item={result} class="w-full" />
			{/each}
		{/if}
	{/key}
</div>
