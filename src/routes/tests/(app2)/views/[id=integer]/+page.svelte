<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import EntryItemSkeleton from '$lib/components/entries/EntryItemSkeleton.svelte';
	import EntryList from '$lib/components/entries/EntryList.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { H1 } from '$lib/components/ui/typography';
	import { cn } from '$lib/utils/tailwind';
	import { PinIcon } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import type { Snapshot } from './$types.js';

	export let data;

	let pinned: boolean;
	$: pinned = !!data.view.pin_id;
	$: query = data.query();
	let entry_list: EntryList | undefined = undefined;

	export const snapshot: Snapshot = {
		capture: () => entry_list?.capture(),
		restore: (id) => entry_list?.restore(id)
	};
</script>

<div class="flex items-center justify-between gap-x-2">
	<H1>{data.view.name}</H1>

	<div class="flex items-center gap-x-2">
		<Button as="a" href="/tests/views/{data.view.id}/edit">Edit</Button>
		<form
			use:enhance={() => {
				pinned = !pinned;
				return ({ update, result }) => {
					update();
					if (result.type === 'success') {
						toast.success(pinned ? 'Pin added' : 'Pin removed', { duration: 2000 });
					}
				};
			}}
			method="post"
			action="?/pin"
		>
			{#if pinned}
				<input type="hidden" name="pin_id" value={data.view.pin_id} />
			{/if}
			<Button variant="ghost" class="group">
				<PinIcon
					class={cn(
						'h-4 w-4 transition-transform group-hover:rotate-6',
						pinned && 'fill-accent-foreground'
					)}
				/>
				<span class="sr-only">{pinned ? 'Remove pin' : 'Pin'}</span>
			</Button>
		</form>
	</div>
</div>
{#key $page.params.id}
	<!-- <EntryList bulkForm={data.bulkForm} entries={data.entries} /> -->
	{#if $query.isLoading}
		<div class="flex flex-col">
			<EntryItemSkeleton />
			<EntryItemSkeleton />
			<EntryItemSkeleton />
			<EntryItemSkeleton />
			<EntryItemSkeleton />
		</div>
	{:else if $query.isSuccess}
		<EntryList
			class="mt-8"
			bulkForm={data.bulkForm}
			entries={$query.data?.pages.flatMap((page) => page?.entries) ?? []}
			on:end={async () => {
				console.log('end', $query);
				$query.fetchNextPage();
			}}
		/>
	{/if}
{/key}
