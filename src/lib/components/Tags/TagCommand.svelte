<script lang="ts">
	import { queryFactory } from '$lib/queries/querykeys';
	import { createQuery } from '@tanstack/svelte-query';
	import { writable } from 'svelte/store';

	import {
		Command,
		CommandInput,
		CommandItem,
		CommandList,
		CommandGroup,
		CommandLoading
	} from '$lib/components/ui/command2';
	import { Checkbox } from '$components/ui/checkbox';
	import { PlusIcon } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { createSetTagsMutation } from '$lib/queries/mutations/index';
	import { onMount, tick } from 'svelte';

	type Tag = { id?: number; name: string };

	const mutation = createSetTagsMutation({
        // optimistic: true
    });

	type MutateProps =
		| {
				shouldMutate: false;
				entryId: never;
		  }
		| {
				shouldMutate: true;
				entryId: number[];
		  };

	type $$Props = {
		selectedTags?: Tag[];
		onSelect?: (tag: Tag) => void;
		showCreate?: boolean;
		open?: boolean;
        autofocus?: boolean;
	} & MutateProps;

	export let entryId: number[] = [];
	export let selectedTags: Tag[] = [];
	export let onSelect: (tag: Tag) => void = () => {};
	export let shouldMutate = false;
	export let showCreate = true;
	export let open = false;
    export let autofocus = false;

    // ye olde json deep copy
    let originalSelectedTagsStr = JSON.stringify(selectedTags);

	const tags = createQuery(queryFactory.tags.list());

	const selectedTagsStore = writable<Tag[]>(selectedTags);

    // update value
    $: selectedTags = $selectedTagsStore;

	function sortFunction(a: Tag, b: Tag) {
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

	let sortedTags = [...($tags.data ?? [])].sort(sortFunction);

	$: if (!open) {
		sortedTags = [...($tags.data ?? [])].sort(sortFunction);
	}

    let input: CommandInput;

    onMount(() => {
        console.log('mounting tag command');
        if (autofocus) {
            console.log('autofocusing', { input});
            setTimeout(() => {
                input?.focus();
            }, 500);
        }
    })
</script>

<Command
	onClose={() => {
		if (shouldMutate && originalSelectedTagsStr !== JSON.stringify($selectedTagsStore)) {
			$mutation.mutate({
				entries: entryId,
				tags: $selectedTagsStore
			});
		}
		tick().then(() => {
			open = false;
		});
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
	<CommandInput {autofocus} bind:this={input} placeholder="Add tag" />
	<CommandList animateHeight={false}>
		<CommandGroup alwaysShow>
			{#if $tags.isLoading}
				<CommandLoading>Loading...</CommandLoading>
			{:else if $tags.isSuccess}
				{#each sortedTags as tag}
					<CommandItem class="group" value={tag} let:isSelected onSelect={() => onSelect(tag)}>
						<Checkbox
							class={cn(
								'mr-2 opacity-0 cursor-default group-data-[highlighted]:opacity-100',
								isSelected && 'opacity-100'
							)}
							checked={isSelected}
						/>
						{tag.name}
					</CommandItem>
				{/each}
				{#if showCreate && inputValue.length > 1 && sortedTags.every(({ name }) => name !== inputValue)}
					<CommandItem
						alwaysShow={true}
						shouldRegister={false}
						id="shadow-new-tag"
						value={{ name: inputValue }}
						let:isSelected
                        onSelect={() => {
                            $selectedTagsStore = [...$selectedTagsStore, { name: inputValue }];
                            onSelect({ name: inputValue });
                        }}
					>
						<PlusIcon class="mr-2 opacity-50 h-4 w-4" />
						<span class="inline-flex grow items-center">
							<span>New tag: </span>
							<span class="font-medium text-muted-foreground">"{inputValue}"</span>
						</span>
					</CommandItem>
				{/if}
			{/if}
		</CommandGroup>
	</CommandList>
</Command>
