<script lang="ts">
	import Header from "$lib/components/layout/Header.svelte";
	import Saved from "$lib/components/Saved.svelte";
	import { recents } from "$lib/stores/recents";
	import type { ArticleWithTags } from "$lib/types";
	import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@rgossiaux/svelte-headlessui";

	export let data: PageData;

	$: ({ results, annotations } = data);

	$: console.log({ data });

	import GenericInput from "$lib/components/GenericInput.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import { useId } from "$lib/hooks/use-id";
	import { onMount } from "svelte";
	import debounce from "lodash.debounce";
	import { goto } from "$app/navigation";
	import CircularProgressBar from "$lib/components/CircularProgressBar/CircularProgressBar.svelte";
	import type { PageData } from "./$types";
	import EntryList from "$lib/components/EntryList.svelte";
	import AnnotationList from "$lib/components/AnnotationList.svelte";
	import { page } from "$app/stores";

	export let value = "";
	let input: HTMLElement;

	onMount(() => {
		input &&
			setTimeout(() => {
				input.focus();
			}, 5);
	});

	const id = `search-${useId()}`;
	let pending = false;

	// handling our own submit here instead of using Form component because we want to do a few things differently
	async function handleSubmit() {
		if (!value) {
			results = [];
			return;
		}
		pending = true;
		// debounce this so we don't send multiple requests for the same search
		const debounced = debounce(async () => {
			// If we use `goto`, we have benefit of Sveltekit's router, which will change the url params. The only downside is that we lose our flip animation.
			// Not sure if we would want to keep the History or not — what's the preferred behvaior?
			await goto(`/u:${$page.data.user?.username}/search?q=${value}`);
			// const response = await fetch(`/search?q=${value}`, {
			// 	headers: {
			// 		'Content-Type': 'application/json',
			// 		Accept: 'application/json'
			// 	}
			// });
			// const json = await response.json();
			// results = json.results;
			recents.addRecentSearch(value);
			pending = false;
		}, 500);
		debounced();
		// TODO: put focus on first search result
	}

	$: data.lazy?.annotations?.then((a) => {
		console.log({ a });
	});
</script>

<!-- TODO: just use use:enhance -->
<!-- TODO: tabs -->
<Header>
	<form class="w-full" on:submit|preventDefault={handleSubmit}>
		<div class="group relative w-full">
			<div class="absolute left-2 flex h-full flex-col justify-center">
				<Icon
					name={pending ? "refreshSolid" : "searchSolid"}
					className="h-4 w-4 fill-gray-400 {pending ? 'animate-spin' : ''}"
				/>
			</div>
			<label for={id} class="sr-only">Search</label>
			<GenericInput
				bind:el={input}
				on:keydown={(e) => {
					if (e.key === "Escape") {
						value = "";
					}
				}}
				bind:value
				placeholder="Search…"
				class="px-8"
				id="search-{useId()}"
				name="q"
			/>
			{#if value}
				<button
					type="button"
					on:click={() => {
						value = "";
						input.focus();
					}}
					class="absolute right-2 top-0 flex h-full flex-col justify-center opacity-0 transition-opacity group-focus-within:opacity-100"
					><Icon name="xSolid" className="h-4 w-4 fill-gray-400" /></button
				>
			{/if}
		</div>
	</form>
</Header>

{#if data.q}
	<!-- <Saved
		html={true}
		quoted={true}
		annotations={results.map((r, i) => ({
			...r,
			title: matches[i].title,
			description: matches[i].content || '',
		}))}
	/> -->
	<!-- TODO: progressive enhancement for tabs -->
	<TabGroup
		defaultIndex={data.tab}
		on:change={(e) => {
			console.log(e.detail);
			const url = $page.url;
			url.searchParams.set("t", e.detail);
			// window.history.pushState({}, '', url);
		}}
	>
		<TabList>
			<Tab>Entries {data.results.length}</Tab>
			<!-- {data.lazy?.annotations} -->
			<Tab
				>Annotations
                <!-- Q: does awaiting a promise twice have performance drawbacks? -->
				{#await data.lazy?.annotations}
					...
				{:then annotations}
					{annotations.length}
				{/await}
			</Tab>
			<!-- <Tab>Annotations {data.annotations.length}</Tab> -->
		</TabList>
		<TabPanels>
			<TabPanel><EntryList items={data.results} /></TabPanel>
			<TabPanel>
				{#await data.lazy?.annotations}
					Loading...
				{:then annotations}
					{#if annotations}
						<AnnotationList {annotations} />
					{:else}
						No annotations found
					{/if}
				{:catch error}
					{error}
				{/await}
			</TabPanel>
		</TabPanels>
	</TabGroup>
{:else}
	<div class="space-y-5 pt-6 text-sm text-gray-400">
		<div>
			<h2 class="px-6">Recent Searches</h2>
			<ul class="pt-2 text-gray-500 dark:text-gray-200">
				{#each $recents.search as recent}
					<li class="flex items-center space-x-3 px-6 py-1 hover:bg-gray-100 dark:hover:bg-gray-700">
						<Icon name="searchSolid" className="h-4 w-4 fill-gray-400" />
						<a
							class="block h-full w-full cursor-default"
							href={`/u:${$page.data.user?.username}/search?q=${recent}`}>{recent}</a
						>
					</li>
				{/each}
			</ul>
		</div>
		<div>
			<h2 class="px-6">Recent Articles</h2>
			<ul class="pt-2 text-gray-500 dark:text-gray-200">
				{#each $recents.articles as { title, id, readProgress }}
					<li class="flex items-center space-x-3 px-6 py-1 hover:bg-gray-100 dark:hover:bg-gray-700">
						<!-- <Icon name="searchSolid" className="h-4 w-4 fill-current" /> -->
						<CircularProgressBar
							value={readProgress || 0}
							minValue={0}
							maxValue={1}
							className="h-3 w-3 flex-none shrink-0 basis-5"
							trailClass="stroke-gray-400"
							pathClass="stroke-red-400"
						/>
						<a class="block h-full w-full cursor-default" href={`/${id}`}>{title}</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
{/if}
