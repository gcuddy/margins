<script lang="ts">
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { Circle, PlusIcon } from 'lucide-svelte';
	import { tick } from 'svelte';

	import { page } from '$app/stores';
	import Button from '$components/ui/button/button.svelte';
	import { Popover, PopoverContent, PopoverTrigger } from '$components/ui/popover';
	import Skeleton from '$components/ui/skeleton/Skeleton.svelte';
	import {
		Command,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList,
		CommandLoading
	} from '$lib/components/ui/command2';
	import { mutation } from '$lib/queries/query';
	import { queryFactory } from '$lib/queries/querykeys';

	export let author: string;
	export let entryId: number;
	export let bookmarkId: number | undefined = undefined;

	const authorsQuery = createQuery(queryFactory.entries.authors());

	// put selected author at top of list, if it exists
	$: sortedAuthors = $authorsQuery.data?.sort((a, b) => {
		if (a === author) {return -1;}
		if (b === author) {return 1;}
		return 0;
	});

	const queryClient = useQueryClient();

	const updateBookmark = createMutation({
		mutationFn: () => {
			return mutation($page, 'updateBookmark', {
				data: {
					author
				},
				entryId,
				id: bookmarkId
			});
		},
		onSuccess: () => {
			// invalidate everything to get new author
			queryClient.invalidateQueries({
				queryKey: ['entries']
			});
		}
	});
	let open = false;
</script>

<Popover bind:open>
	<PopoverTrigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} class="justify-start w-fit">
			{author}
		</Button>
	</PopoverTrigger>
	<PopoverContent class="p-0">
		<Command
			let:filtered
			let:inputValue
			bind:value={author}
			onClose={() => {
				tick().then(() => {
					$updateBookmark.mutate();
					open = false;
				});
			}}
		>
			<CommandInput placeholder="Author…" />
			<CommandList>
				<CommandGroup alwaysShow>
					{#if $authorsQuery.isLoading}
						<CommandLoading>
							{#each [1, 2, 3] as _}
								<Skeleton class="h-10 w-full" />
							{/each}
						</CommandLoading>
					{:else if $authorsQuery.isError}
						<CommandEmpty>
							<span class="text-red-500">Error loading authors</span>
						</CommandEmpty>
					{:else if $authorsQuery.isSuccess}
						{#if inputValue.length > 1 && $authorsQuery.data.every((name) => name.toLowerCase() !== inputValue.toLowerCase())}
							<CommandItem alwaysShow id="shadow-new-author" value={inputValue}>
								<PlusIcon class="mr-2 opacity-50 h-4 w-4" />
								<span class="inline-flex grow items-center">
									<span>Set author: </span>
									<span class="font-medium text-muted-foreground">"{inputValue}"</span>
								</span>
							</CommandItem>
						{/if}
						{#each $authorsQuery.data as author}
							<CommandItem class="pl-8" value={author} let:isSelected>
								<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
									{#if isSelected}
										<Circle class="h-2 w-2 fill-current" />
									{/if}
								</span>
								<span>{author}</span>
							</CommandItem>
						{/each}
					{/if}
				</CommandGroup>
			</CommandList>
		</Command>
	</PopoverContent>
</Popover>
