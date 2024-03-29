import { Node, mergeAttributes } from '@tiptap/core';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import Timestamp from './timestamp/Timestamp.svelte';
import Srs from './srs/SRSNode.svelte';
import type { MarkdownNodeSpec } from 'tiptap-markdown';

export const TimestampNode = Node.create({
	name: 'timestamp',
	group: 'inline',
	atom: true,
	inline: true,
	selectable: true,

	addAttributes() {
		return {
			timestamp: {
				default: null
			},
			entry_id: {
				default: null
			},
			pindex_id: {
				default: null
			},
			youtube_id: {
				default: null
			},
			title: {
				default: null
			},
			image: {
				default: null
			}
		};
	},

	parseHTML() {
		return [{ tag: 'timestamp' }];
	},

	renderHTML({ HTMLAttributes }) {
		return ['timestamp', mergeAttributes(HTMLAttributes)];
	},

	addNodeView() {
		return SvelteNodeViewRenderer(Timestamp);
	}
});

export const SRSNode = Node.create({
	name: 'srs',
	group: 'block',
	atom: true,
	inline: false,
	selectable: true,
	// content: "inline*",
	// isloating: true,
	// defining: true,
	// selectable: true,
	// content: "inline*",

	addAttributes() {
		return {
			id: {
				default: null
			},
			entry_id: {
				default: null
			},
			prompt: {
				default: null
			},
			response: {
				default: null
			}
			// active: {
			//     default: false
			// }
		};
	},

	// TODO: enforce this for markdown
	addStorage(): { markdown: MarkdownNodeSpec } {
		return {
			markdown: {
				serialize(state, node) {
					// TODO Srs customization
					// For now, write the prompt and response as markdown
					// Prompt should start with Q., Response should start with A.
					state.write(`Q. ${node.attrs.prompt}\n`);
					state.write(`A. ${node.attrs.response}\n\n`);
				}
			}
		};
	},

	parseHTML() {
		return [{ tag: 'srs-component' }];
	},

	renderHTML({ HTMLAttributes }) {
		return ['srs-component', mergeAttributes(HTMLAttributes)];
	},

	addNodeView() {
		return SvelteNodeViewRenderer(Srs);
	},

	addKeyboardShortcuts() {
		return {
			// Backspace
			Backspace: (e) => {
				console.log(`Backspace`, e);
				return this.editor.commands.command(({ tr, state }) => {
					let isNode = false;
					const { selection } = state;
					const { empty, anchor } = selection;

					if (!empty) {
						return false;
					}

					state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
						if (node.type.name === this.name) {
							isNode = true;
							tr.insertText(this.options.suggestion.char || '', pos, pos + node.nodeSize);

							return false;
						}
					});

					return isNode;
				});
			}
		};
	}
});
