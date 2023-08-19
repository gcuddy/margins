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
	import { createSetTagsMutation } from '$lib/queries/mutations/index';
	import { queryFactory } from '$lib/queries/querykeys';
	import { cn } from '$lib/utils';
	import { createQuery } from '@tanstack/svelte-query';
	import { PlusIcon } from 'lucide-svelte';
	import { writable } from 'svelte/store';

	const query = createQuery({
		...queryFactory.tags.list()
		// enabled: false,
	});

	const mutation = createSetTagsMutation();

	// TODO: allow creation of tags given tmdb/spotify/googlebooks/podcastindex
	export let entryId: number[];
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

		<Popover
			bind:open
			portal={wrapper}
			positioning={{
				placement: 'left',
				overlap: true,
				strategy: 'fixed'
				// flip: false
			}}
		>
			<PopoverTrigger>+ Tag</PopoverTrigger>
			<PopoverContent class="p-0">
				<Command
					onClose={() => {
						$mutation.mutate({
							entries: entryId,
							tags: $selectedTagsStore
						});
						open = false;
					}}
					selectedValue={selectedTagsStore}
					comparisonFunction={(a, b) => {
						return a.id === b.id;
					}}
					valueToString={(tag) => tag.name}
					multiple
					let:inputValue
				>
					<!--  -->
					<CommandInput placeholder="Add tag" />
					<CommandList animateHeight={false}>
						<CommandGroup alwaysShow>
							{#if $query.isLoading}
								<CommandLoading>Loading...</CommandLoading>
							{:else if $query.isSuccess}
								{#each sortedTags as tag}
									<CommandItem class="group" value={tag} let:isSelected>
										<Checkbox class={cn(
                                            "mr-2 opacity-0 cursor-default group-data-[highlighted]:opacity-100",
                                            isSelected && 'opacity-100'
                                        )} checked={isSelected} />
										{tag.name}
									</CommandItem>
								{/each}
								{#if inputValue.length > 1 && sortedTags.every(({ name }) => name !== inputValue)}
									<CommandItem
										alwaysShow={true}
										shouldRegister={false}
										id="shadow-new-tag"
										value={{ name: inputValue }}
										let:isSelected
									>
										<PlusIcon class="mr-2 opacity-50 h-4 w-4" />
										<span class="inline-flex grow items-center">
											<span>New tag: </span>
											<span class="font-medium text-muted-foreground">"{inputValue}"</span>
										</span>
									</CommandItem>
								{/if}
							{/if}
							<!--  -->
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	</Cluster>
</div>
