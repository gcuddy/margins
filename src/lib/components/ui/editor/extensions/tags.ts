// import { query, type QueryOutput } from "$lib/queries/query";
import { Node, mergeAttributes, type Editor, type Range } from '@tiptap/core';
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion';

import Tags from './Tags.svelte';

import { page } from '$app/stores';
import { recents } from '$lib/stores/recents';
import type { Page } from '@sveltejs/kit';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { PluginKey } from '@tiptap/pm/state';
import type { ComponentType } from 'svelte';
import type { Unsubscriber } from 'svelte/store';
import { get } from 'svelte/store';

interface CommandItemProps {
	title: string;
	description: string;
	icon: ComponentType;
}

interface CommandProps {
	editor: Editor;
	range: Range;
}

type TagOptions = {
	HTMLAttributes: Record<string, any>;
	renderLabel: (props: { options: TagOptions; node: ProseMirrorNode }) => string;
	suggestion: Omit<SuggestionOptions, 'editor'>;
};

const Command = Node.create<TagOptions>({
	name: 'tag',
	addOptions() {
		return {
			suggestion: {
				char: '#',
				allowSpaces: false,
				decorationClass: 'tag',
				pluginKey: new PluginKey('tag'),
				command: ({
					editor,
					range,
					props
				}: {
					editor: Editor;
					range: Range;
					props: { id: number; name: string };
				}) => {
					console.log({ editor, range, props });
					const nodeAfter = editor.view.state.selection.$to.nodeAfter;
					const overrideSpace = nodeAfter?.text?.startsWith(' ');

					if (overrideSpace) {
						range.to += 1;
					}

					editor
						.chain()
						.focus()
						.insertContentAt(range, [
							{
								type: this.name,
								attrs: props
							},
							{
								type: 'text',
								text: ' '
							}
						])
						.run();

					window.getSelection()?.collapseToEnd();

					// props.command({ editor, range });
				},
				allow: ({ state, range }) => {
					const $from = state.doc.resolve(range.from);
					const type = state.schema.nodes[this.name];
					const allow = !!$from.parent.type.contentMatch.matchType(type);

					return allow;
				}
			},
			HTMLAttributes: {},
			renderLabel: ({ node }) => {
				return `#${node.attrs.name}`;
			}
		};
	},

	group: 'inline',
	inline: true,
	atom: true,
	selectable: false,

	addAttributes() {
		return {
			id: {
				default: null,
				parseHTML: (element) => element.getAttribute('data-id'),
				renderHTML: (attributes) => {
					if (!attributes.id) {
						return {};
					}

					return {
						'data-id': attributes.id
					};
				}
			},

			name: {
				default: null,
				parseHTML: (element) => element.getAttribute('data-name'),
				renderHTML: (attributes) => {
					if (!attributes.name) {
						return {};
					}

					return {
						'data-name': attributes.name
					};
				}
			}
		};
	},

	parseHTML() {
		return [
			{
				tag: `a[data-type="${this.name}"]`
			}
		];
	},

	renderHTML(props) {
        const { node, HTMLAttributes } = props;
        console.log(`renderHTML`, {props})
		return [
			'a',
			mergeAttributes(
				{ 'data-type': this.name, href: `/tests/tag/${node.attrs.name}` },
				this.options.HTMLAttributes,
				HTMLAttributes
			),
			this.options.renderLabel({
				options: this.options,
				node
			})
		];
	},

	renderText({ node }) {
		return this.options.renderLabel({
			options: this.options,
			node
		});
	},



	addKeyboardShortcuts() {
		return {
			Backspace: () =>
				this.editor.commands.command(({ tr, state }) => {
					let isMention = false;
					const { selection } = state;
					const { empty, anchor } = selection;

					if (!empty) {
						return false;
					}

					state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
						if (node.type.name === this.name) {
							isMention = true;
							tr.insertText(this.options.suggestion.char || '', pos, pos + node.nodeSize);

							return false;
						}
					});

					return isMention;
				})
		};
	},

	addProseMirrorPlugins() {
		return [
			Suggestion({
				editor: this.editor,
				...this.options.suggestion
			})
		];
	}
});

let $page: Page | null = null;
let unsubscribePage: Unsubscriber | null;

const getSuggestionItems = async ({ query: q }: { query: string }) => {
	if (!unsubscribePage) {
		unsubscribePage = page.subscribe((p) => {
			$page = p;
		});
	}

	const tags = await $page?.data.user_data?.tags;
	if (!tags) return [];

	return tags.filter((tag) => tag.name.toLowerCase().includes(q.toLowerCase()));
};

const Tag = Command.configure({
	suggestion: {
		// TODO: debounce
		items: getSuggestionItems,
		render: () => {
			let component: Tags;
			const popup: any | null = null;

			return {
				onStart: (props) => {
					component = new Tags({
						target: document.body,
						props
					});
				},
				onUpdate: (props) => {
					component?.$$set?.(props);

					popup &&
						popup[0].setProps({
							getReferenceClientRect: props.clientRect
						});
				},
				onKeyDown: (props) => {
					if (props.event.key === 'Escape') {
						popup?.[0].hide();

						return true;
					}

					return false;

					// return component?.ref?.onKeyDown(props);
				},
				onExit: () => {
					popup?.[0].destroy();
					component?.$destroy();
					unsubscribePage?.();
				}
			};
		}
	}
});

export default Tag;

Command
