import StarterKit from '@tiptap/starter-kit';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import TiptapLink from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
import Placeholder, { PlaceholderOptions } from '@tiptap/extension-placeholder';
import TiptapUnderline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import { Markdown } from 'tiptap-markdown';
import Highlight from '@tiptap/extension-highlight';
import Mathematics from '@tiptap-pro/extension-mathematics';

// TODO: Mentions

import SlashCommand from './slash-command';
import Youtube from '@tiptap/extension-youtube';

import { InputRule } from '@tiptap/core';
import BookmarkCommand from './bookmarks';
import { SvelteCounterExtension } from '../nodes/link';
import { iframeNode } from '../nodes/iframes';
import AnnotationCommand from './annotations';
import { AnnotationExtension } from '../nodes/annotation';
import { TimestampNode } from '../nodes';
import Flashcard from '../nodes/flashcard';
import Tag from './tags';

export type TiptapExtensionProps = {
	placeholder?:
		| string
		| (Partial<PlaceholderOptions> & {
				nonFocusedPlaceholder?: string;
		  });
};

export const generate_tiptap_extensions = (
	props: TiptapExtensionProps = {},
	context?: any,
) => {
	// TODO: get context (as passed in), then pass in to things like SlashCommands
	const TiptapExtensions = [
		StarterKit.configure({
			bulletList: {
				HTMLAttributes: {
					class: 'list-disc list-outside leading-3 -mt-2',
				},
			},
			orderedList: {
				HTMLAttributes: {
					class: 'list-decimal list-outside leading-3 -mt-2',
				},
			},
			listItem: {
				HTMLAttributes: {
					class: 'leading-normal -mb-2',
				},
			},
			blockquote: {
				HTMLAttributes: {
					class: 'border-l-4 border',
				},
			},
			codeBlock: {
				HTMLAttributes: {
					class:
						'rounded-sm bg-stone-100 p-5 font-mono font-medium text-stone-800',
				},
			},
			code: {
				HTMLAttributes: {
					class:
						'rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black',
					spellcheck: 'false',
				},
			},
			horizontalRule: false,
			dropcursor: {
				color: '#DBEAFE',
				width: 4,
			},
			gapcursor: false,
		}),
		// patch to fix horizontal rule bug: https://github.com/ueberdosis/tiptap/pull/3859#issuecomment-1536799740
		HorizontalRule.extend({
			addInputRules() {
				return [
					new InputRule({
						find: /^(?:---|—-|___\s|\*\*\*\s)$/,
						handler: ({ state, range }) => {
							const attributes = {};

							const { tr } = state;
							const start = range.from;
							const end = range.to;

							tr.insert(start - 1, this.type.create(attributes)).delete(
								tr.mapping.map(start),
								tr.mapping.map(end),
							);
						},
					}),
				];
			},
		}).configure({
			HTMLAttributes: {
				class: 'mt-4 mb-6 border-t border-stone-300',
			},
		}),
		TiptapLink.configure({
			HTMLAttributes: {
				class:
					'text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer',

				// target: null // opens in current tab
			},
		}),
		TiptapImage.configure({
			allowBase64: true,
			HTMLAttributes: {
				class: 'rounded-lg border',
			},
		}),
		Placeholder.configure({
			placeholder: ({ node, editor }) => {
				if (node.type.name === 'heading') {
					return `Heading ${node.attrs.level}`;
				}
				if (
					!editor.isFocused &&
					typeof props.placeholder === 'object' &&
					props.placeholder?.nonFocusedPlaceholder
				) {
					return props.placeholder.nonFocusedPlaceholder;
				}
				return typeof props.placeholder === 'string'
					? props.placeholder
					: "Press '/' for commands...";
			},
			includeChildren: true,
			showOnlyWhenEditable: false,
			...(typeof props.placeholder === 'object' ? props.placeholder : {}),
		}),
		SlashCommand,
		BookmarkCommand,
		AnnotationCommand,
		TiptapUnderline,
		TextStyle,
		Color,
		Highlight.configure({
			multicolor: true,
		}),
		TaskList.configure({
			HTMLAttributes: {
				class: 'not-prose pl-2',
			},
		}),
		TaskItem.configure({
			HTMLAttributes: {
				class: 'flex items-start my-4',
			},
			nested: true,
		}),
		Markdown.configure({
			linkify: true,
			transformCopiedText: true,
		}),
		SvelteCounterExtension,
		AnnotationExtension,
		iframeNode,
		Youtube,
		TimestampNode,
		Mathematics,
		Flashcard,
		Tag,
	];
	return TiptapExtensions;
};
