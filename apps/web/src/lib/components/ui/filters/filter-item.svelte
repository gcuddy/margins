<script lang="ts">
	import { Badge, badgeVariants } from '$components/ui/badge';
	import { cn } from '$lib';
	import type { FilterLibrarySchema } from '$lib/schemas/library';
	import { XIcon } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import { ctx } from './ctx';
	import { omit } from '$lib/helpers';

	export let title: string;
	export let icon: ComponentType;
	export let value: string | undefined = undefined;
	export let comparator: string | undefined = undefined;

	export let onDelete: (() => void) | keyof FilterLibrarySchema;
	// for example, onDelete="type" will delete the type filter with the key "type" from the search query
	export let key: string | undefined = undefined;

	const {
		helpers: { navigateSearch },
	} = ctx.get();

	$: valueClass = cn(
		badgeVariants({ variant: 'outline' }),
		'rounded-none min-w-0 border-r cursor-pointer truncate',
		comparator ? 'border-l-0' : 'border-l',
	);
</script>

<div class="flex h-6 min-w-0 transition-[width]">
	<Badge
		variant="outline"
		class="rounded-md rounded-r-none border-r-0 flex gap-1"
	>
		<svelte:component this={icon} class="h-3 w-3 text-muted-foreground" />
		<span>{title}</span>
	</Badge>
	<slot name="comparator">
		{#if comparator}
			<Badge class="rounded-none border-x" variant="outline">
				{comparator}
			</Badge>
		{/if}
	</slot>
	<slot name="value" c={valueClass}>
		<!-- TODO  -->
		{#if value}
			<div class={valueClass}>
				<span class="truncate max-w-[150px]">
					{value}
				</span>
			</div>
		{/if}
	</slot>
	<button
		on:click={() => {
			if (typeof onDelete === 'function') {
				onDelete();
			} else if (typeof onDelete === 'string') {
				const filter = onDelete;
				navigateSearch((data) => {
					const { [filter]: item, ...rest } = data;
					console.log({ filter, item, rest, data });
					if (item && key) {
						if (typeof item === 'object') {
							//@ts-expect-error - not super elegant, but it works
							const newItem = omit(item, key);
							console.log({ newItem });
                            return newItem;
							if (Object.keys(item).length === 0) {
                                console.log('empty object')
								return newItem;
							} else {
								rest[filter] = newItem;
								return rest;
							}
						}
					}
					return rest;
				});
			}
		}}
		class={cn(
			badgeVariants({ variant: 'outline' }),
			// 'rounded-l-none border-l-0 rounded-r-md',
			'rounded-md rounded-l-none border-l-0',
		)}
	>
		<XIcon class="w-3 h-3" />
	</button>
</div>
