<script lang="ts">
	import { page } from '$app/stores';
	import { inputVariants } from '$components/ui/Input.svelte';
	import { mutation } from '$lib/queries/query';
	import { queryFactory } from '$lib/queries/querykeys';
	import { cn } from '$lib/utils';
	import { createCombobox, melt } from '@melt-ui/svelte';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';

	export let author: string;
	export let entryId: number;
    export let bookmarkId: number | undefined = undefined;

	const authorsQuery = createQuery(queryFactory.entries.authors());

    const queryClient = useQueryClient();

	const updateBookmark = createMutation({
		mutationFn: (author: string) => {
			return mutation($page, 'updateBookmark', {
				entryId,
                id: bookmarkId,
				data: {
					author
				}
			});
		},
        onSuccess: () => {
            // invalidate everything to get new author
            queryClient.invalidateQueries({
                queryKey: [
                    "entries"
                ]
            })
        }
	});

	const {
		elements: { input, item, menu },
		helpers: { updateItems },
		options,
		states: { open, filteredItems, inputValue }
	} = createCombobox<{
		author: string;
		shadow?: boolean;
	}>({
		items:
			$authorsQuery.data?.map((author) => ({
				author,
				shadow: false
			})) ?? [],
		filterFunction: ({ author }, query) => {
			return author.toLowerCase().includes(query.toLowerCase());
		},
        itemToString: ({ author }) => author,
		defaultValue: { author },
		onValueChange: ({ next }) => {
			console.log({ next });
			if (next) {
				$updateBookmark.mutate(next.author);
			}
			return next;
		}
	});

	$: if ($authorsQuery.isSuccess)
		updateItems(() => $authorsQuery.data?.map((author) => ({ author })) ?? []);

	$: showAdd = $filteredItems.every(({ author }) => author !== $inputValue);

	$: if (showAdd) {
		// update items to put shadow item at front
		updateItems((items) => {
			// filter out old shadow item
			const filtered = items.filter(({ shadow }) => !shadow);
			// add new shadow item
			return [{ author: $inputValue, shadow: true }, ...filtered];
		});
	} else {
        // remove shadow item
        updateItems((items) => items.filter(({ shadow }) => !shadow));
    }

	// $: if ($inputValue) {
	//     updateItems((items) => {
	//         if (items.every((author) => author !== $inputValue)) {
	//             return [...items, $inputValue];
	//         }
	//         return items;
	//     });
	// }
</script>

<input type="text" use:melt={$input} class={cn(
    inputVariants({ variant: 'ghost' }),
    'px-2'
)} />

<ul class="z-10 flex max-h-[300px] flex-col overflow-hidden rounded-md" use:melt={$menu}>
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div
		class="flex max-h-full flex-col gap-2 overflow-y-auto bg-popover text-popover-foreground px-2 py-2"
		tabindex="0"
	>
		{#if showAdd}
			<li
				class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50"
				use:melt={$item({
					index: 0,
					item: {
						author: $inputValue,
						shadow: true
					}
				})}
			>
				<span>+ Add <span class="font-semibold">{$inputValue}</span></span>
			</li>
		{/if}
		{#if $filteredItems.length !== 0}
			{#each $filteredItems.filter(({shadow}) => !shadow) as filteredItem, index (index)}
				<li
					use:melt={$item({
						index: showAdd ? index + 1 : index,
						item: filteredItem
					})}
					class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50"
				>
					<div>
						<span>{filteredItem.author}</span>
					</div>
				</li>
			{/each}
		{/if}
	</div>
</ul>
