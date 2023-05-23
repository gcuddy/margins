<script lang="ts">
	import PinButton from '$lib/components/PinButton.svelte';
	import EntryList from '$lib/components/entries/EntryList.svelte';
	import { H1 } from '$lib/components/ui/typography';
	import { TagIcon } from 'lucide-svelte';
	import type { Snapshot } from './$types.js';

	export let data;
	let entrylist: EntryList;
	export const snapshot: Snapshot = {
		capture: () => entrylist?.capture(),
		restore: (snapshot) => entrylist?.restore(snapshot)
	};

	let loading = false;
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
	<EntryList
		class="mt-8"
		bulkForm={data.bulkForm}
		entries={data.entries}
		on:end={async () => {
			if (loading || !data.nextCursor) return;
			loading = true;

			const response = await fetch(`/api/entries/tag/${data.tag.name}?cursor=${data.nextCursor}`);
			const result = await response.json();

			//@ts-ignore
			data.entries = [...data.entries, ...result.entries]; data.nextCursor = result.nextCursor;

			loading = false;
		}}
	/>
</div>
