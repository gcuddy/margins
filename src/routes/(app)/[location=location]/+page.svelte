<script lang="ts">
	import { signOut, getSession } from 'lucia-sveltekit/client';
	const lucia = getSession();
	console.log({ $lucia });
	import type { PageData } from './$types';
	import CustomizeView from '$lib/components/CustomizeView.svelte';
	import Filter from '$lib/components/Filter.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import Saved from '$lib/components/Saved.svelte';
	import { goto } from '$app/navigation';
	import LocationListbox from '$lib/components/LocationListbox.svelte';
	export let data: PageData;
	$: user = data.user;
	$: console.log({ $user });
	$: location = data?.location;
	$: ({ articles } = $user);
	$: sortedArticles = articles.filter((a) => a.location === location);
</script>

<Header>
	<DefaultHeader>
		<div slot="start">
			<LocationListbox
				{location}
				on:change={(e) => {
					location = e.detail;
					goto(`/${location.toLowerCase()}`);
				}}
			/>
		</div>
		<div slot="end" class="flex">
			<Filter />
			<CustomizeView />
		</div>
	</DefaultHeader>
</Header>

<Saved
	articles={sortedArticles || articles}
	on:update={(e) => {
		console.log('update', e);
		e.detail.articles.forEach((article) => {
			articles = articles.map((a) => (a.id === article.id ? article : a));
		});
	}}
/>
