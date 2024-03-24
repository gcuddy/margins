<script lang="ts">
	import type { Editor } from 'svelte-tiptap';
	import { Check, ChevronDown, Trash } from 'lucide-svelte';
	import { writable } from 'svelte/store';

	export let editor: Editor;

	export let open = writable(false);
	interface BubbleColorMenuItem {
		name: string;
		color: string | null;
	}

	const TEXT_COLORS: BubbleColorMenuItem[] = [
		{
			name: 'Default',
			color: '#000000'
		},
		{
			name: 'Purple',
			color: '#9333EA'
		},
		{
			name: 'Red',
			color: '#E00000'
		},
		{
			name: 'Yellow',
			color: '#EAB308'
		},
		{
			name: 'Blue',
			color: '#2563EB'
		},
		{
			name: 'Green',
			color: '#008A00'
		},
		{
			name: 'Orange',
			color: '#FFA500'
		},
		{
			name: 'Pink',
			color: '#BA4081'
		},
		{
			name: 'Gray',
			color: '#A8A29E'
		}
	];

	const HIGHLIGHT_COLORS: BubbleColorMenuItem[] = [
		{
			name: 'Default',
			color: '#ffffff'
		},
		{
			name: 'Purple',
			color: '#F6F3F8'
		},
		{
			name: 'Red',
			color: '#FDEBEB'
		},
		{
			name: 'Yellow',
			color: '#FEF9C3'
		},
		{
			name: 'Blue',
			color: '#E6F3F7'
		},
		{
			name: 'Green',
			color: '#EDF3EC'
		},
		{
			name: 'Orange',
			color: '#FAEBDD'
		},
		{
			name: 'Pink',
			color: '#FAF1F5'
		},
		{
			name: 'Gray',
			color: '#F1F1EF'
		}
	];

	$: activeColorItem = TEXT_COLORS.find(({ color }) => editor.isActive('textStyle', { color }));

	$: activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) =>
		editor.isActive('highlight', { color })
	);
</script>

<div class="relative w-full">
	<button
		on:click={() => open.set(!$open)}
		class="flex h-full items-center gap-1 p-2 text-sm font-medium text-stone-600 hover:bg-stone-100 active:bg-stone-200"
	>
		<span
			class="rounded-sm px-1"
			style:color={activeColorItem?.color}
			style:background-color={activeHighlightItem?.color}
		>
			A
		</span>
		<ChevronDown class="h-4 w-4" />
	</button>
	{#if $open}
		<section
			class="fixed top-full z-[99999] mt-1 flex w-48 flex-col overflow-hidden rounded border border-stone-200 bg-white p-1 shadow-xl animate-in fade-in slide-in-from-top-1"
		>
			<div class="my-1 px-2 text-sm text-stone-500">Color</div>
			{#each TEXT_COLORS as { name, color }}
				<button
					on:click={() => {
						editor.commands.unsetColor();
						name !== 'Default' && color && editor.chain().focus().setColor(color).run();
						$open = false;
					}}
					class="flex items-center justify-between rounded-sm px-2 py-1 text-sm text-stone-600 hover:bg-stone-100"
				>
					<div class="flex items-center space-x-2">
						<div class="rounded-sm border border-stone-200 px-1 py-px font-medium" style:color>
							A
						</div>
						<span>{name}</span>
					</div>
					{#if editor.isActive('textStyle', { color })}
						<Check class="h-4 w-4" />
					{/if}
				</button>
			{/each}
			<div class="mb-1 mt-2 px-2 text-sm text-stone-500">Background</div>
			{#each HIGHLIGHT_COLORS as { name, color }}
				<button
					on:click={() => {
						editor.commands.unsetHighlight();
						name !== 'Default' && color && editor.chain().focus().setHighlight({
							color
						}).run();
						$open = false;
					}}
					class="flex items-center justify-between rounded-sm px-2 py-1 text-sm text-stone-600 hover:bg-stone-100"
				>
					<div class="flex items-center space-x-2">
						<div class="rounded-sm border border-stone-200 px-1 py-px font-medium" style:background-color={color}>
							A
						</div>
						<span>{name}</span>
					</div>
					{#if editor.isActive('highlight', { color })}
						<Check class="h-4 w-4" />
					{/if}
				</button>
			{/each}
		</section>
	{/if}
</div>
