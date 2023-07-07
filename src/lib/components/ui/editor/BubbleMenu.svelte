<script lang="ts" context="module">
	import type { ComponentType } from 'svelte';

	export interface BubbleMenuItem {
		name: string;
		isActive: () => boolean;
		command: () => void;
		icon: ComponentType;
	}
</script>

<script lang="ts">
	import { BubbleMenu, Editor } from 'svelte-tiptap';
	import type { BubbleMenuPluginProps } from '@tiptap/extension-bubble-menu';

	export let editor: Editor;
	let shouldShow: BubbleMenuPluginProps['shouldShow'] = undefined;


	const node_selector_is_open = writable(false);
	const link_selector_is_open = writable(false);
	const color_selector_is_open = writable(false);
	$: if ($link_selector_is_open) {
		node_selector_is_open.set(false);
		color_selector_is_open.set(false);
	} else if ($node_selector_is_open) {
		link_selector_is_open.set(false);
		color_selector_is_open.set(false);
	} else if ($color_selector_is_open) {
		link_selector_is_open.set(false);
		node_selector_is_open.set(false);
	}

	$: shouldShow = ({ editor }) => {
		// don't show if image is selected
		if (editor.isActive('image')) {
			return false;
		}
		return editor.view.state.selection.content().size > 0;
	};

	import { BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon, CodeIcon } from 'lucide-svelte';
	import { cn } from '$lib/utils/tailwind';
	import NodeSelector from './NodeSelector.svelte';
	import LinkSelector from './LinkSelector.svelte';
	import { writable } from 'svelte/store';
	import ColorSelector from './ColorSelector.svelte';

	const items: BubbleMenuItem[] = [
		{
			name: 'bold',
			isActive: () => editor.isActive('bold'),
			command: () => editor.chain().focus().toggleBold().run(),
			icon: BoldIcon
		},
		{
			name: 'italic',
			isActive: () => editor.isActive('italic'),
			command: () => editor.chain().focus().toggleItalic().run(),
			icon: ItalicIcon
		},
		{
			name: 'underline',
			isActive: () => editor.isActive('underline'),
			command: () => editor.chain().focus().toggleUnderline().run(),
			icon: UnderlineIcon
		},
		{
			name: 'strike',
			isActive: () => editor.isActive('strike'),
			command: () => editor.chain().focus().toggleStrike().run(),
			icon: StrikethroughIcon
		},
		{
			name: 'code',
			isActive: () => editor.isActive('code'),
			command: () => editor.chain().focus().toggleCode().run(),
			icon: CodeIcon
		}
	];
</script>

<BubbleMenu {editor} {shouldShow}>
	<div
		class="flex w-fit divide-x divide-stone-200 rounded border border-stone-200 bg-white shadow-xl"
	>
		<NodeSelector {editor} open={node_selector_is_open} />
		<LinkSelector {editor} open={link_selector_is_open}  />
		<div class="flex">
			{#each items as item}
				<button
					on:click={item.command}
					class="p-2 text-stone-600 hover:bg-stone-100 active:bg-stone-200"
				>
                    <svelte:component this={item.icon} class={cn('h-4 w-4', {
                        'text-blue-500': item.isActive()
                    })} />
				</button>
			{/each}
		</div>
       <ColorSelector {editor} />
	</div>
</BubbleMenu>
