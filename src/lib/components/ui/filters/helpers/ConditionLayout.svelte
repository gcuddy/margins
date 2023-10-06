<script lang="ts">
	import Badge, { badgeVariants } from '$components/ui/Badge.svelte';
	import { cn } from '$lib/utils';
	import { createEventDispatcher, getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	const dispatch = createEventDispatcher();
	export let name: string;
	const container = getContext('filterContainer') as Writable<HTMLDivElement | null>;
	import { Select, SelectContent, SelectGroup, SelectItem } from '$components/ui/select';
	import { Select as SelectPrimitive } from '@huntabyte/primitives';
	import { melt } from '@melt-ui/svelte';

	export let choices: {
		name: string;
		value: string;
		disabled?: boolean;
	}[] = [];

    export let type: string | undefined = undefined;

	export let value: any | undefined = undefined;
</script>

<div class="flex h-6">
	<Badge variant="outline" class="rounded-r-none border-r-0">{name}</Badge>
	{#if choices.length}
		<Select
			portal={$container}
			positioning={{
				placement: 'bottom-start'
			}}
			bind:value
		>
			<SelectPrimitive.Trigger let:builder asChild>
				<div
					use:melt={builder}
					class={cn(
						badgeVariants({
							variant: 'outline'
						}),
						'rounded-none'
					)}
				>
					<slot name="trigger" {value} />
				</div>
			</SelectPrimitive.Trigger>
			<SelectContent>
				<SelectGroup>
					{#each choices as { value, name, disabled }}
						<SelectItem {disabled} {value}>{name}</SelectItem>
					{/each}
				</SelectGroup>
			</SelectContent>
		</Select>
	{/if}

	<slot />
	{#if $$slots.value}
		<Badge variant="outline" class={
            cn(
                "rounded-none border-x-0",
                !$$slots.default && !choices.length && "border-l"
            )
        }>
			<slot name="value" />
		</Badge>
	{/if}

	<button
		on:click={() => {
			dispatch('delete');
		}}
		class={cn(badgeVariants({ variant: 'outline' }), 'rounded-l-none')}
	>
		x
	</button>
</div>
