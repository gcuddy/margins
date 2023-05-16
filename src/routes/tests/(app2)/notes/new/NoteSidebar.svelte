<script lang="ts">
	import { page } from "$app/stores";
	import Input from "$lib/components/ui/Input.svelte";
	import { QueryOutput, q } from "$lib/queries/query";
	import { Loader2 } from "lucide-svelte";
	import Annotation from "../../(listables)/[type=type]/[id]/Annotation.svelte";
	import {
		Tabs,
		TabsContent,
		TabsList,
		TabsTrigger,
	} from "$lib/components/ui/tabs";
	import { entries } from "lodash";
	import EntryList from "$lib/components/entries/EntryList.svelte";
	import { createEventDispatcher } from "svelte";
	let value = "";

	//TODO: populate with recents
	let notes = [];
	const client = q({
		...$page,
		userId: $page.data.user_data?.userId,
	});

	const dispatch = createEventDispatcher();
	let promise: Promise<QueryOutput<"searchNotes">> | null = null;

	let entries_promise: Promise<QueryOutput<"search">> | null = null;

	function debounce(delay: number) {
		let timeout: number | undefined = undefined;
		return (fn: () => void) => {
			if (timeout) clearTimeout(timeout);
			timeout = setTimeout(fn, delay) as unknown as number;
		};
	}

	$: if (value.length > 0) {
		debounce(500)(() => {
			promise = client.query("searchNotes", {
				q: value,
			});
		});
		debounce(500)(() => {
			entries_promise = client.query("search", {
				q: value,
			});
		});
	}

	function handleEntryClick(e: MouseEvent) {
		// get data-id
		console.log(e.target);
		const target = e.target as HTMLElement;
		const id = target.dataset.id;
		if (id) {
			e.preventDefault();
			dispatch("entry", id);
		}
	}
</script>

<Input bind:value type="text" placeholder="Search" />

<Tabs>
	<TabsList>
		<TabsTrigger>Annotations</TabsTrigger>
		<TabsTrigger>Entries</TabsTrigger>
	</TabsList>
	<TabsContent>
		{#if promise}
			{#await promise}
				<Loader2 class="h-5 w-5 animate-spin" />
			{:then annotations}
				{#each annotations as annotation}
					<Annotation {annotation} />
				{/each}
			{:catch error}
				Error occured
			{/await}
		{/if}</TabsContent
	>
	<TabsContent>
		{#if entries_promise}
			{#await entries_promise}
				<Loader2 class="h-5 w-5 animate-spin" />
			{:then entries}
				<EntryList on:click={handleEntryClick} {entries} />
				<!-- {#each entries as entry}
				{/each} -->
			{:catch error}
				Error occured
			{/await}
		{/if}</TabsContent
	>
</Tabs>
<!-- {#each notes as note}
	{note.title}
{/each} -->
