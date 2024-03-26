<script lang="ts">
	import { cn } from '$lib/utils/tailwind';
	import type { CreateCombobox } from './utils';

	type T = $$Generic;
	export let menu: CreateCombobox<T>['menu'];
	export let open: CreateCombobox<T>['open'];
	export let filteredItems: CreateCombobox<T>['filteredItems'];
	export let item: CreateCombobox<T>['item'];
	export let isSelected: CreateCombobox<T>['isSelected'];

	// You should be able to *either* use slot props or get the component and do it yourself
	// for now this is a compromise (but a mildly annoying one... these props should probably be on the item itself)
	export let itemClass = '';
	export let disabled: ((item: T) => boolean) | undefined = undefined;

	let className = '';
	export { className as class };
	// TODO: allow groupss (see Items type in ./utils for idea)
</script>

<ul
	class={cn('z-10 flex max-h-[300px] flex-col overflow-hidden rounded-md', className)}
	{...$menu}
	use:menu
>
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div class="flex max-h-full flex-col overflow-y-auto text-foreground bg-white px-2 py-2" tabindex="0">
		{#if $open}
			{#if $filteredItems.length !== 0}
				{#each $filteredItems as filteredItem, index (index)}
					{@const _disabled = disabled ? disabled(filteredItem) : false}
					<li
						{...$item({
							index,
							item: filteredItem,
							disabled: _disabled
						})}
						use:item
						class={cn(
							'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
							itemClass
						)}
					>
						<slot
							name="item"
							isSelected={$isSelected}
							item={filteredItem}
							{index}
							disabled={_disabled}
						>
							<!-- TODO -->
						</slot>
						<!-- {#if $isSelected(filteredItem)}
							<div class="check">
								<Check />
							</div>
						{/if}
						<div>
							<span>{book.title}</span>
							<span class="block text-sm opacity-70">{book.author}</span>
						</div> -->
					</li>
				{/each}
			{:else}
				<li
					class="relative cursor-pointer rounded-md py-1 pl-8 pr-4
                    text-center"
				>
					<slot name="empty">
                        No results found
                    </slot>
				</li>
			{/if}
		{/if}
	</div>
</ul>
