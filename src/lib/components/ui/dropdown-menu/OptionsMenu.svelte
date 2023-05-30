<script lang="ts">
	import type { VariantProps } from 'class-variance-authority';
	import { buttonVariants } from '../Button.svelte';
	import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger} from './index';
	import { cn } from '$lib/utils/tailwind';
	import { MoreHorizontal } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import type { Placement } from '@popperjs/core';

	export let variant: VariantProps<typeof buttonVariants>['variant'] = 'default';
	export let size: VariantProps<typeof buttonVariants>['size'] = 'default';
	let className = '';
    export let placement: Placement = 'bottom-end'
	export { className as class };

	type Item = {
		text: string;
		onSelect: () => void;
		icon?: ComponentType;
        kbd?: string;
	};

	export let items: Item[][] = [];
</script>

<DropdownMenu>
	<DropdownMenuTrigger
		class={cn(buttonVariants({
			variant,
			size
		}), className)}
	>
		<slot name="trigger">
			<MoreHorizontal class={cn('h-5 w-5')} />
		</slot>
	</DropdownMenuTrigger>
	<DropdownMenuContent {placement} class="w-56">
		{#each items as group, i}
			<DropdownMenuGroup>
				{#each group as item}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<DropdownMenuItem on:click={item.onSelect}>
						<!--  -->
                        {#if item.icon}
                            <svelte:component this={item.icon} class="h-4 w-4 mr-2" />
                        {/if}
                        <span>
                            {item.text}
                        </span>
                        {#if item.kbd}
                            <DropdownMenuShortcut>
                                {item.kbd}
                            </DropdownMenuShortcut>
                        {/if}
					</DropdownMenuItem>
				{/each}
			</DropdownMenuGroup>
            {#if i < items.length - 1}
                <DropdownMenuSeparator />
            {/if}
		{/each}
	</DropdownMenuContent>
</DropdownMenu>
