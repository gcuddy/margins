<script lang="ts">
	import { Checkbox } from '$components/ui/checkbox';
	import { Popover, PopoverContent, PopoverTrigger } from '$components/ui/popover2';

	import {
		Command,
		CommandInput,
		CommandItem,
		CommandItems,
		CommandList,
		CommandGroup,
		CommandEmpty,
		CommandSeparator,
		CommandShortcut,
		CommandLoading
	} from '$lib/components/ui/command2';
	import { queryFactory } from '$lib/queries/querykeys';
	import { styleToString } from '@melt-ui/svelte/internal/helpers';
	import { createQuery } from '@tanstack/svelte-query';
	import { createVirtualizer } from '@tanstack/svelte-virtual';
	import { writable } from 'svelte/store';

	const query = createQuery({
		...queryFactory.tags.list()
		// enabled: false,
	});

	export let selectedTags: { id: number; name: string }[] = [];
	const selectedTagsStore = writable(selectedTags);

    function sortFunction(a: typeof selectedTags[0], b: typeof selectedTags[0]) {
		const selected = $selectedTagsStore.find((t) => t.id === a.id);
		const selected2 = $selectedTagsStore.find((t) => t.id === b.id);
		if (selected && selected2) {
			return 0;
		} else if (selected) {
			return -1;
		} else if (selected2) {
			return 1;
		} else {
			return 0;
		}
	}

	let sortedTags = [...($query.data ?? [])].sort(sortFunction);

	$: if (!open) {
		sortedTags = [...($query.data ?? [])].sort(sortFunction);
	}

    let open = false;

    let scroller = writable<HTMLElement | null>(null)

    const virtualizer = createVirtualizer({
        count: $query.data?.length ?? 0,
        estimateSize: () => 32,
        overscan: 10,
        getScrollElement: () => $scroller,
        debug: true,
        onChange: (instance) => console.log({instance})
    })

    $: console.log({$virtualizer})

    $: $virtualizer.setOptions({
        count: $query.data?.length ?? 0,
        getScrollElement: () => $scroller,
    })

</script>

<Popover bind:open>
	<PopoverTrigger>+ Tag</PopoverTrigger>
	<PopoverContent class="p-0">
		<Command
			onClose={() => (open = false)}
			selectedValue={selectedTagsStore}
			comparisonFunction={(a, b) => {
				return a.id === b.id;
			}}
			valueToString={(tag) => tag.name}
			multiple
		>
			<!--  -->
			<CommandInput placeholder="Add tag" />
			<CommandList bind:el={$scroller}>
					<div class="w-full relative" style:height="{$virtualizer.getTotalSize()}px">
						{#if $query.isLoading}
							<CommandLoading>Loading...</CommandLoading>
						{:else if $query.isSuccess}
							{#each $virtualizer.getVirtualItems() as row (row.key)}
								{@const tag = sortedTags[row.index]}
								{#if tag}
									<div
										style={styleToString({
											position: 'absolute',
											top: 0,
											left: 0,
											width: '100%',
											height: `${row.size}px`,
											transform: `translateY(${row.start}px)`
										})}
									>
										<CommandItem value={tag} let:isSelected>
											<Checkbox class="mr-2" checked={isSelected} />
											{tag.name}
										</CommandItem>
									</div>
								{/if}
							{/each}
						{/if}
						<!--  -->
					</div>
			</CommandList>
		</Command>
	</PopoverContent>
</Popover>
