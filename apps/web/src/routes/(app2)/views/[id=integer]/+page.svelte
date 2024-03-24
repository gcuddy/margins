<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils/tailwind';
	import { PinIcon } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { readable } from 'svelte/store';
	import type { QueryInput } from '$lib/queries/query';
	import List from '$components/entries/list.svelte';
	import Header from '$components/ui/Header.svelte';

	export let data;

	let pinned: boolean;
	$: pinned = !!data.view.pin_id;

	$: opts = readable({
		dir: 'desc',
		filter: data.view.filterData,
		library: data.view.entryFilterType === 'Library',
		sort: 'published',
		status: null,
	} satisfies QueryInput<'get_library'>);

    import { ChevronRight, Pencil1 } from 'radix-icons-svelte';

</script>

<Header>
    <div class="flex items-center min-w-0">
        <a href="/views" class="flex items-center"><span>Views</span> <ChevronRight /></a>
        <span>{data.view.name}</span>
    </div>
    <svelte:fragment slot="end">
		<form
			use:enhance={() => {
				pinned = !pinned;
				return ({ update, result }) => {
					update();
					if (result.type === 'success') {
						toast.success(pinned ? 'Pin added' : 'Pin removed', {
							duration: 2000,
						});
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
						pinned && 'fill-accent-foreground',
					)}
				/>
				<span class="sr-only">{pinned ? 'Remove pin' : 'Pin'}</span>
			</Button>
		</form>
        <Button variant="outline" size="sm" href="/views/{data.view.id}/edit">
            <Pencil1 class="mr-1" />
            Edit</Button>

    </svelte:fragment>
</Header>
<!-- TOD: where to put description? -->
<!--
<div class="flex items-center justify-between gap-x-2">
	<H1>{data.view.name}</H1>

	<div class="flex items-center gap-x-2">

	</div>
</div> -->
<!-- TODO: Add sorting -->
{#key $page.params.id}
	<!-- <EntryList bulkForm={data.bulkForm} entries={data.entries} /> -->
	{#if data.view.filterData}
		<List {opts} />
	{/if}
{/key}
