<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { PlusIcon } from 'lucide-svelte';
	import { writable, derived } from 'svelte/store';

	import Cluster from '$components/helpers/Cluster.svelte';
	import { Badge } from '$components/ui/badge';
	import { Button } from '$components/ui/button';
	import Checkbox from '$components/ui/Checkbox.svelte';
	import {
		Popover,
		PopoverContent,
		PopoverTrigger,
	} from '$components/ui/popover';
    import PopoverDialog from '$components/popover-dialog.svelte';
	import {
		Command,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList,
		CommandLoading,
	} from '$lib/components/ui/command2';
	import { createSetTagsMutation } from '$lib/queries/mutations/index';
	import { queryFactory } from '$lib/queries/querykeys';
	import { cn } from '$lib/utils';
	import { TagColorPill } from '$components/tags/tag-color';
	import { commandItemVariants } from '$components/ui/command2/style';
	import { Skeleton } from '$components/ui/skeleton';

	const open = writable(false);

	const query = createQuery(
		derived(open, ($open) => ({
			...queryFactory.tags.list(),
			enabled: $open,
		})),
	);

    $: console.log({$query})

	const mutation = createSetTagsMutation();

	// TODO: allow creation of tags given tmdb/spotify/googlebooks/podcastindex
	export let entryId: Array<number>;
	export let selectedTags: Array<{ id: number; name: string; color: string }> =
		[];
	const selectedTagsStore = writable(
		selectedTags.map((t) => ({
			value: t,
		})),
	);

	$: if (selectedTags !== undefined) {
		selectedTagsStore.set(
			selectedTags.map((t) => ({
				value: t,
			})),
		);
	}

	function sortFunction(
		a: (typeof selectedTags)[0],
		b: (typeof selectedTags)[0],
	) {
		const selected = $selectedTagsStore.find((t) => t.value.id === a.id);
		const selected2 = $selectedTagsStore.find((t) => t.value.id === b.id);
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

	$: sortedTags = [...($query.data ?? [])].sort(sortFunction);

	// $: if (!$open) {
	// 	sortedTags = [...($query.data ?? [])].sort(sortFunction);
	// }

	let wrapper: HTMLElement;

	const loading = writable(false);

	$: $loading = $query.isLoading;

	$: console.log({ $loading });
</script>

<div bind:this={wrapper}>
	<Cluster class="gap-2.5">
		{#each $selectedTagsStore as { value: { name, color } }}
			<Badge as="a" href="/tag/{name}" variant="outline">
				<TagColorPill class="h-2 w-2 mr-1.5" color={color ?? '#000000'} />
				{name}</Badge
			>
		{/each}

		<Popover
			bind:open={$open}
			portal={wrapper}
			positioning={{
				overlap: true,
				placement: 'left',
				strategy: 'fixed',
				// flip: false
			}}
		>
			<PopoverTrigger asChild let:builder>
				<Button builders={[builder]} variant="ghost">+ Tag</Button>
			</PopoverTrigger>
			<PopoverDialog bind:open={$open} class="p-0">
				<Command
					{loading}
					onClose={() => {
						$mutation.mutate({
							entries: entryId,
							tags: $selectedTagsStore.map((t) => t.value),
						});
						$open = false;
					}}
					type={selectedTags[0]}
					selectedValue={selectedTagsStore}
					comparisonFunction={(a, b) => {
						return a.id === b.id;
					}}
					multiple
					let:inputValue
				>
					<!--  -->
					<CommandInput placeholder="Add tag" />
					{#if $query.isSuccess}
						<CommandList animateHeight={false}>
							<CommandGroup>
								<!-- <CommandLoading>
                                    <div class="flex flex-col gap-2">
                                        <Skeleton class="h-6 p-1" />
                                        <Skeleton class="h-6 p-1" />
                                        <Skeleton class="h-6 p-1" />
                                        <Skeleton class="h-6 p-1" />
                                        <Skeleton class="h-6 p-1" />
                                    </div>
                                </CommandLoading> -->
								{#each sortedTags as tag}
									<CommandItem class="group" value={tag} let:isSelected>
										<Checkbox
											class={cn(
												'mr-2 opacity-0 cursor-default group-data-[highlighted]:opacity-100',
												isSelected && 'opacity-100',
											)}
											checked={isSelected}
										/>
										{tag.name}
									</CommandItem>
								{/each}
								{#if inputValue.length > 1 && sortedTags.every(({ name }) => name !== inputValue)}
									<CommandItem id="shadow-new-tag" value={{ name: inputValue }}>
										<PlusIcon class="mr-2 opacity-50 h-4 w-4" />
										<span class="inline-flex grow items-center">
											<span>New tag: </span>
											<span class="font-medium text-muted-foreground"
												>"{inputValue}"</span
											>
										</span>
									</CommandItem>
								{/if}
								<!--  -->
							</CommandGroup>
						</CommandList>
					{/if}
				</Command>
			</PopoverDialog>
		</Popover>
	</Cluster>
</div>
