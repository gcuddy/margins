<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	$: ({ articles } = data);
	import Saved from '$lib/components/Saved.svelte';
	import { cachedArticlesStore } from '$lib/stores/cache';
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import Filter from '$lib/components/Filter.svelte';
	cachedArticlesStore.set({
		articles,
		lastUpdate: new Date()
	});
</script>

<svelte:head><title>Margins</title></svelte:head>

<Header>
	<DefaultHeader>
		<div slot="start">
			<select name="" id="">
				<option>Inbox</option>
				<option>Up Next</option>
				<option>Later</option>
				<option>Archive</option>
			</select>
		</div>
		<div slot="end">
			<Filter />
		</div>
	</DefaultHeader>
</Header>

<div class="flex h-full flex-auto flex-col overflow-hidden">
	<!-- todo; overflow-auto and get scrolling to work only WITHIN this container... -->
	<div class="relative overflow-auto">
		<Saved {articles} />
	</div>
</div>
