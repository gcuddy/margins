<script lang="ts">
	import type { PageData } from './$types';
	import CustomizeView from '$lib/components/CustomizeView.svelte';
	import Filter from '$lib/components/Filter.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import Saved from '$lib/components/Saved.svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import LocationListbox from '$lib/components/LocationListbox.svelte';
	import { defaultViewOptions, type ViewOptions } from '$lib/types/schemas/View';
	import { page } from '$app/stores';
	import EntryList from '$lib/components/EntryList.svelte';
	import Filters from '$lib/components/Filters/Index.svelte';
	export let data: PageData;
	$: ({ location } = data);
	// this shouldn't be necessary, since we're requesting from the server - but maybe good to keep in case we want to do something client-side?
	// $: sortedArticles = articles.filter((a) => a.location === location);
	let viewOptions: ViewOptions = defaultViewOptions;
	$: console.log({ data });
	$: data.currentList.set({
		type: 'bookmarks',
		slug: $page.url.pathname,
		items: data.entries,
	});
</script>

<Header>
	<DefaultHeader>
		<div slot="start">
			<LocationListbox
				{location}
				on:change={(e) => {
					location = e.detail;
					goto(`/u:${$page.params.username}/${location.toLowerCase()}`);
				}}
			/>
		</div>
		<div slot="end" class="flex">
			<Filter />
			<CustomizeView bind:viewOptions />
		</div>
	</DefaultHeader>
</Header>
<!-- {JSON.stringify(data.bookmarks, null, 2)} -->
<!-- <Saved
	items={data.entries || data.bookmarks || []}
	{viewOptions}
	on:update={(e) => {
		console.log('update', e);
		e.detail.articles.forEach((article) => {
			articles = articles.map((a) => (a.id === article.id ? article : a));
		});
	}}
/> -->
<Filters />
<EntryList items={data.entries} />
