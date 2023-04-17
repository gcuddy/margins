<script lang="ts">
	import { getId } from "$lib/utils/entries";

	import { createEventDispatcher } from "svelte";

	import smoothload from "$lib/actions/smoothload";
	import Button from "$lib/components/ui/Button.svelte";

	import type { Entry } from "@prisma/client";
	import Intersector from "../Intersector.svelte";
	import { Subtle } from "../ui/typography";

	type EntryInList = Pick<
		Entry,
		| "id"
		| "title"
		| "type"
		| "image"
		| "googleBooksId"
		| "tmdbId"
		| "uri"
		| "podcastIndexId"
	>;

	type T = $$Generic<EntryInList>;

	export let entries: T[];

	const dispatch = createEventDispatcher();

	function getDomain(url: string) {
		const domain = url.replace(/https?:\/\//, "").split("/")[0];
		return domain;
	}
</script>

<ul class="space-y-4">
	{#each entries as entry}
		<li class="flex items-center space-x-4">
			{#if entry.image || entry.uri}
				<img
					use:smoothload
					src={entry.image ??
						`https://icon.horse/icon/${getDomain(entry.uri ?? "")}`}
					on:error={(e) => {
						if (entry.uri) {
							//@ts-ignore
							e.target.src = `https://icon.horse/icon/${getDomain(entry.uri)}`;
						}
					}}
					alt=""
					class="h-16 w-16 rounded-md object-cover"
				/>
			{:else}
				<!--  -->
			{/if}
			<div class="flex flex-col">
				<Subtle class="text-xs">{entry.type}</Subtle>
				<a
					class="line-clamp-2 font-semibold hover:underline"
					href="/tests/{entry.type}/{getId(entry)}"
				>
					{entry.title}
				</a>
			</div>
		</li>
	{/each}
	<Intersector cb={() => dispatch("end")} />
</ul>
