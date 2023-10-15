<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import ItemArtwork from '$lib/components/ItemArtwork.svelte';
	import Annotation from '$lib/components/notebook/Annotation.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/Label.svelte';
	import { tabList } from '$lib/components/ui/tabs/TabsList.svelte';
	import { tabTrigger } from '$lib/components/ui/tabs/TabsTrigger.svelte';
	import { H1 } from '$lib/components/ui/typography';
	import { cn } from '$lib/utils/tailwind';
	import { Search } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	export let data;
	const prefix = $page.url.pathname;
	const tabs = [
		{
			name: 'My stuff',
			href: 'my'
		},
		{
			name: 'Notebook',
			href: 'notes'
		},
		{
			name: 'Movies + TV',
			href: 'movies'
		},
		{
			name: 'Books',
			href: 'books'
		},
		{
			name: 'Podcasts',
			href: 'podcasts'
		},
		{
			name: 'Music',
			href: 'music'
		}
	];
	let q = data.q ?? '';
	// $: q = $page.url.searchParams.get("q") ?? "";
	$: tab = $page.url.searchParams.get('type');

	const setType = (type: string) => {
		const Url = $page.url;
		Url.searchParams.set('type', type);
		if (q) Url.searchParams.set('q', q);
		return Url.toString();
	};
	let loading = false;
</script>

<H1>Search</H1>

<form data-sveltekit-keepfocus class="my-4">
	<input type="hidden" name="type" value={tab} />
	<Label for="search" class="sr-only">Search</Label>
	<div class="flex items-center">
		<Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
		<Input autofocus class="" bind:value={q} id="search" name="q" placeholder="search" />
	</div>
</form>
<div>
	<div class={tabList}>
		<!--  -->
		{#each tabs as { name, href }}
			{@const selected = tab === href}
			<a href="?type={href}{q ? '&q=' + q : ''}" class={tabTrigger({ selected })}>
				{name}
			</a>
		{/each}
	</div>
</div>

<div
	class=" mt-4 grid grid-cols-2 gap-x-1 gap-y-4 px-2 pb-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
>
	{#key data.results}
		{#if data.notes}
			{#each data.notes || [] as note}
				<Annotation class="col-span-2" annotation={note} />
			{/each}
		{:else}
			{#each data.results || [] as result}
				<ItemArtwork {q} item={result} class="w-32" />
			{/each}
		{/if}
	{/key}
</div>
