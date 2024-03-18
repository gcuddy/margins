import { type Editor, Extension, type Range } from '@tiptap/core';
import Suggestion, { type SuggestionProps } from '@tiptap/suggestion';
import {
	CheckSquare,
	ClockIcon,
	Code,
	Heading1,
	Heading2,
	Heading3,
	Image as ImageIcon,
	List,
	ListOrdered,
	MessageSquarePlus,
	SparklesIcon,
	Text,
	TextQuote,
} from 'lucide-svelte';
import type { ComponentType } from 'svelte';
import { get } from 'svelte/store';
import { createPopperActions } from 'svelte-popperjs';
import tippy from 'tippy.js';

import { page } from '$app/stores';
import { buttonVariants } from '$components/ui/Button.svelte';
import { nanoid } from '$lib/nanoid';
import player from '$lib/stores/player';

import { handleImageUplaod } from '../utils';
import SlashCommand__SvelteComponent_ from './SlashCommand.svelte';

type CommandItemProps = {
	title: string;
	description: string;
	icon: ComponentType;
};

type CommandProps = {
	editor: Editor;
	range: Range;
};

const Command = Extension.create({
	name: 'slash-command',
	addOptions() {
		return {
			suggestion: {
				char: '/',
	import {
		ArrowRight,
		Cog,
		CreditCard,
		Search,
		Settings,
		StickyNote,
		TagIcon,
	} from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { derived, type Writable, writable } from 'svelte/store';

	import { goto } from '$app/navigation';
	import { page as spage } from '$app/stores';
	import { checkedEntryIds } from '$components/entries/multi-select';
	import { Badge } from '$components/ui/badge';
	import {
		Books,
		EntryCommands,
		Movies,
		Music,
		Podcasts,
		Subscriptions,
		Tags,
	} from '$lib/commands';
	import Annotations from '$lib/commands/Annotations.svelte';
	import Collections from '$lib/commands/Collections.svelte';
	import JumpToEntry from '$lib/commands/JumpToEntry.svelte';
	import Query from '$lib/commands/Query.svelte';
	import { cmd_open } from '$lib/components/ui/command/stores';
	import {
		CommandDialog,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList,
		CommandSeparator,
		CommandShortcut,
	} from '$lib/components/ui/command2';
	import {
		darkThemes,
		themes,
		updateTheme,
	} from '$lib/features/settings/themes';
	import { objectEntries } from '$lib/helpers';
	import { queryKeys } from '$lib/queries/keys';
	import { createSetTagsMutation } from '$lib/queries/mutations';
	import { checkedCommandBadgeDisplay } from '$lib/stores/entry-state';
					.toggleNode('paragraph', 'paragraph')
					.run();
			},
		},
		{
			title: 'To-do List',
			description: 'Track tasks with a to-do list.',
			searchTerms: ['todo', 'task', 'list', 'check', 'checkbox'],
			icon: CheckSquare,
			command: ({ editor, range }: CommandProps) => {
				editor.chain().focus().deleteRange(range).toggleTaskList().run();
			},
		},
		{
			title: 'Heading 1',
			description: 'Big section heading.',
			searchTerms: ['title', 'big', 'large', 'h1'],
			icon: Heading1,
			command: ({ editor, range }: CommandProps) => {
				editor
					.chain()
					.focus()
					.deleteRange(range)
					.setNode('heading', { level: 1 })
					.run();
			},
		},
		{
			title: 'Heading 2',
			description: 'Medium section heading.',
			searchTerms: ['subtitle', 'medium', 'h2'],
			icon: Heading2,
			command: ({ editor, range }: CommandProps) => {
				editor{return;}
					.chain()
					.focus()
					.deleteRange(range)
					.setNode('heading', { level: 2 })
					.run();
			},
		},
		{
			title: 'Heading 3',
			description: 'Small section heading.',
			searchTerms: ['subtitle', 'small', 'h3'],
			icon: Heading3,
			command: ({ editor, range }: CommandProps) => {
				editor
					.chain()
					.focus()
					.deleteRange(range)
					.setNode('heading', { level: 3 })
					.run();
			},
		},
		{
			title: 'Bullet List',
			description: 'Create a simple bullet list.',
			searchTerms: ['unordered', 'point'],
			icon: List,
			command: ({ editor, range }: CommandProps) => {
				editor.chain().focus().deleteRange(range).toggleBulletList().run();
			},
		},
		{
			title: 'Numbered List',
			description: 'Create a list with numbering.',
			searchTerms: ['ordered'],
			icon: ListOrdered,
			command: ({ editor, range }: CommandProps) => {
				editor.chain().focus().deleteRange(range).toggleOrderedList().run();
			},
		},
		{
			title: 'Quote',
			description: 'Capture a quote.',
			searchTerms: ['blockquote'],
			icon: TextQuote,
			command: ({ editor, range }: CommandProps) =>
	const hideDefault = false;
					.chain()
					.focus()
					.deleteRange(range)
					.toggleNode('paragraph', 'paragraph')
					.toggleBlockquote()
					.run(),
		},
		{
			title: 'Code',
			description: 'Capture a code snippet.',
			searchTerms: ['codeblock'],
			icon: Code,
			command: ({ editor, range }: CommandProps) =>
				editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
		},
		{
			title: 'Image',
			description: 'Upload an image from your computer.',
			searchTerms: ['photo', 'picture', 'media'],
			icon: ImageIcon,
			command: ({ editor, range }: CommandProps) => {
				editor.chain().focus().deleteRange(range).run();
				// upload image
				const input = document.createElement('input');
				input.type = 'file';
				input.accept = 'image/*';
				input.onchange = async (event) => {
					if (input.files?.length) {
						const file = input.files[0];
						return handleImageUplaod(file, editor.view, event);
					}
				};
				input.click();
			},
		},
	];

	if (video) {
		items.push({
			title: 'Timestamp',
			description: 'Capture a timestamp.',
			searchTerms: ['timestamp', 'time', 'video'],
			icon: ClockIcon,
			command: async ({ editor, range }: CommandProps) => {
				// TODO: get player from page
				const $player = get(player);
				if ($player && $player.type === 'youtube') {
					console.log('hello');
					const time = Math.floor(
						Number(await $player.player.getCurrentTime()),
					);
					editor
						.chain()
						.focus()
						.insertContentAt(range, [
							// {
							//     type: this.name,
							//     attrs: props,
							// },
							// {
							//     type: 'text',
							//     text: props.title,
							// },
							{
								type: 'timestamp',
								attrs: {
									timestamp: time,
									entry_id: $page.data.entry?.id,
									youtube_id: $page.data.entry?.youtubeId,
									title: $page.data.entry?.title,
								},
							},
						])
						.run();
				}
			},
		});
	}

	if (audio) {
		items.push({
			title: 'Timestamp',
			description: 'Capture a timestamp from the current audio.',
			searchTerms: ['timestamp', 'time', 'audio'],
			icon: ClockIcon,
			command: async ({ editor, range }: CommandProps) => {
				const $audioPlayer = get($player.player);
				const time = $audioPlayer.state.currentTime;
				editor
					.chain()
					.focus()
					.insertContentAt(range, [
						{
							type: 'timestamp',
							attrs: {
								timestamp: time,
								entry_id: $audioPlayer.audio?.entry_id,
								title: $audioPlayer.audio?.title,
								image: $audioPlayer.audio?.image,
							},
						},
					])
					.run();
			},
		});
	}

	return items.filter((item) => {
		if (typeof query === 'string' && query.length > 0) {
			const search = query.toLowerCase();
			return (
				item.title.toLowerCase().includes(search) ||
				item.description.toLowerCase().includes(search) ||
				(item.searchTerms &&
					item.searchTerms.some((term: string) => term.includes(search)))
			);
		}
		return true;
	});
};

export const updateScrollView = (container: HTMLElement, item: HTMLElement) => {
	const containerHeight = container.offsetHeight;
	const itemHeight = item ? item.offsetHeight : 0;

	const top = item.offsetTop;
	const bottom = top + itemHeight;

	if (top < container.scrollTop) {
		container.scrollTop -= container.scrollTop - top + 5;
	} else if (bottom > containerHeight + container.scrollTop) {
		container.scrollTop += bottom - containerHeight - container.scrollTop + 5;
	}
};

const renderItems = () => {
	let component: SlashCommand__SvelteComponent_;
	const popup: any | null = null;

	return {
		onStart: (props: SuggestionProps) => {
			const [ref, content] = createPopperActions({});
			const context = new Map();
			ref(document.body);
			context.set('content_action', content);
			component = new SlashCommand__SvelteComponent_({
				target: document.body,
				props,
			});
		},
		onUpdate: (props: { editor: Editor; clientRect: DOMRect }) => {
			component?.$$set?.(props);

			popup &&
				popup[0].setProps({
					getReferenceClientRect: props.clientRect,
				});
		},
		onKeyDown: (props: { event: KeyboardEvent }) => {
			if (props.event.key === 'Escape') {
				popup?.[0].hide();

				return true;
			}

			// return component?.ref?.onKeyDown(props);
		},
		onExit: () => {
			popup?.[0].destroy();
			component?.$destroy();
		},
	};
};

function CreateSlashCommand(context: any) {}

const SlashCommand = Command.configure({
	suggestion: {
		items: getSuggestionItems,
		render: renderItems,
	},
});

export default SlashCommand;
