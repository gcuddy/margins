<script lang="ts">
	import PinButton from '$lib/components/PinButton.svelte';
	import EntryList from '$lib/components/entries/EntryList.svelte';
	import { H1, Muted } from '$lib/components/ui/typography';
	import { TagIcon } from 'lucide-svelte';
	import type { Snapshot } from './$types.js';
	import { createTabsContext } from '$components/ui/tabs/utils';
	import { TabsContent, TabsList, TabsTrigger } from '$components/ui/tabs';
	import Annotation from '$components/notebook/Annotation.svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { queryParam, ssp } from 'sveltekit-search-params';

	export let data;
	let entrylist: EntryList;
	export const snapshot: Snapshot = {
		capture: () => entrylist?.capture(),
		restore: (snapshot) => entrylist?.restore(snapshot)
	};

	let loading = false;

	const tab = queryParam('tab', ssp.string(), { pushHistory: false });

	const { root, value } = createTabsContext({
		value: 'entries',
		onChange: (value) => {
			tab.set(value);
		}
	});
</script>

<div class="space-y-4">
	<div class="flex items-center justify-between">
		<H1 class="flex items-baseline space-x-3">
			<TagIcon />
			<span>
				{data.tag.name}
			</span>
		</H1>
		<PinButton pin_id={data.tag.pin_id}>
			<input type="hidden" name="tag_id" value={data.tag.id} />
		</PinButton>
	</div>
	<div melt={$root}>
		<TabsList>
			<TabsTrigger class="gap-1.5" value="entries"
				><span>Entries</span> <Muted>{data.entries.length}</Muted></TabsTrigger
			>
			<TabsTrigger class="gap-1.5" value="notes"
				><span>Notes</span>
				<Muted>{data.notes.length}</Muted>
				<!-- {#await data.lazy.notes then notes}<Muted>{notes.length}</Muted>{/await} -->
			</TabsTrigger>
		</TabsList>
		<TabsContent value="entries">
			<EntryList
				class="mt-8"
				bulkForm={data.bulkForm}
				entries={data.entries}
				on:end={async () => {
					if (loading || !data.nextCursor) return;
					loading = true;

					const response = await fetch(
						`/api/entries/tag/${data.tag.name}?cursor=${data.nextCursor}`
					);
					const result = await response.json();

					//@ts-ignore
					data.entries = [...data.entries, ...result.entries];
					data.nextCursor = result.nextCursor;

					loading = false;
				}}
			/></TabsContent
		>
		<TabsContent value="notes">
			<!-- {#await data.lazy.notes}
				loading...
			{:then notes} -->
			{#each data.notes as note}
				<Annotation annotation={note} />
			{/each}
			<!-- {/await} -->
		</TabsContent>
	</div>
</div>
