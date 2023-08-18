<script lang="ts">
	import Cluster from '$components/helpers/Cluster.svelte';
	import Badge from '$components/ui/Badge.svelte';
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
	import { createQuery } from '@tanstack/svelte-query';
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
    let wrapper: HTMLElement;
</script>

<div bind:this={wrapper}>
	<Cluster class="gap-2.5">
		{#each $selectedTagsStore as tag}
			<Badge variant="secondary">{tag.name}</Badge>
		{/each}

		<Popover bind:open portal={wrapper} positioning={{
            placement: "left",
            overlap: true,
            strategy: "fixed"
            // flip: false
        }}>
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
					<CommandList>
						<CommandGroup>
							{#if $query.isLoading}
								<CommandLoading>Loading...</CommandLoading>
							{:else if $query.isSuccess}
								{#each sortedTags.slice(0, 20) as tag}
									<CommandItem value={tag} let:isSelected>
										<Checkbox class="mr-2" checked={isSelected} />
										{tag.name}
									</CommandItem>
								{/each}
							{/if}
							<!--  -->
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	</Cluster>
</div>
