import { mergeAttributes, Node } from '@tiptap/core'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { PluginKey } from '@tiptap/pm/state'
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion'
import { get } from 'svelte/store'

import MentionList, { createMentionListState } from '$lib/components/TipTap/MentionList.svelte'
import { localFileNames } from '$lib/features/garden/store'

export type MentionOptions = {
    HTMLAttributes: Record<string, any>
    renderLabel: (props: { options: MentionOptions; node: ProseMirrorNode }) => string
    suggestion: Omit<SuggestionOptions, 'editor'>
}

export const suggestion: Omit<SuggestionOptions<any>, "editor"> = {
        items: async ({ query }) => {
            const localNames = get(localFileNames)
            const filtered = localNames.filter((name) => name.includes(query)).slice(0, 20);
            return filtered.map((name) => {
                return {
                    id: name,
                    label: name,
                };
            });
        },
        char: "[[",
        decorationTag: "span",
        render: () => {
            let component: MentionList;
            //store.dispatch("onKeydown");
            // REVIEW: this is a hack-y way to get the keyboard event to the child component
            // TODO: support selectItem

            const state = createMentionListState();

            let command: (props: any) => void;
            return {
                onStart: (props) => {
                    console.log({ props });
                    state.setItems(props.items);
                    state.setProps(props);
                    command = props.command;
                    component = new MentionList({
                        target: document.body,
                        props: {
                            ...props,
                            state,
                        },
                    });
                },
                onKeyDown: ({ event }) => {
                    console.log(event);
                    if (event.key === "ArrowUp") {
                        state.up();
                        return true;
                    }
                    if (event.key === "ArrowDown") {
                        state.down();
                        return true;
                    }
                    if (event.key === "Enter") {
                        // state.select();
                        // get(state).props.command
                        state.selectItem();
                        return true;
                        // TODO: how to get it to replace the text?
                        // command({id:});
                    }
                    if (event.key === "Escape") {
                        // hide
                    }
                    // TODO: if event.key === "Enter" then selectItem
                    return false;
                },
                onUpdate: (props) => {
                    state.setItems(props.items);
                    state.setProps(props);
                    component.$set(props);
                },
                onExit: () => component.$destroy(),
            };
        },
}
export const MentionPluginKey = new PluginKey('localFileMention')

export const LocalFileMention = Node.create<MentionOptions>({
    name: 'localFileMention',
    addOptions() {
        return {
            HTMLAttributes: {
                class: 'local-file-mention'
            },
            renderLabel({ options, node }) {
                return `${node.attrs.label ?? node.attrs.id}`
            },
            suggestion: {
                char: '[[',
                pluginKey: MentionPluginKey,
                command: ({ editor, range, props }) => {
                    // increase range.to by one when the next node is of type "text"
                    // and starts with a space character
                    const nodeAfter = editor.view.state.selection.$to.nodeAfter
                    const overrideSpace = nodeAfter?.text?.startsWith(' ')

                    if (overrideSpace) {
                        range.to += 1
                    }

                    editor
                        .chain()
                        .focus()
                        .insertContentAt(range, [
                            {
                                type: this.name,
                                attrs: props,
                            },
                            {
                                type: 'text',
                                text: ' ',
                            },
                        ])
                        .run()

                    window.getSelection()?.collapseToEnd()
                },
                allow: ({ state, range }) => {
                    const $from = state.doc.resolve(range.from)
                    const type = state.schema.nodes[this.name]
                    const allow = !!$from.parent.type.contentMatch.matchType(type)

                    return allow
                },
            },
        }
    },

    group: 'inline',

    inline: true,

    selectable: false,

    atom: true,

    addAttributes() {
        return {
            id: {
                default: null,
                parseHTML: element => element.getAttribute('data-id'),
                renderHTML: attributes => {
                    if (!attributes.id) {
                        return {}
                    }
                    return {
                        'data-id': attributes.id,
                    }
                },
            },

            label: {
                default: null,
                parseHTML: element => element.getAttribute('data-label'),
                renderHTML: attributes => {
                    if (!attributes.label) {
                        return {}
                    }
                    return {
                        'data-label': attributes.label,
                    }
                },
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: `span[data-type="${this.name}"]`,
            },
        ]
    },

    renderHTML({ node, HTMLAttributes, }) {
        return [
            'span',
            mergeAttributes({ 'data-type': this.name }, this.options.HTMLAttributes, HTMLAttributes),
            this.options.renderLabel({
                options: this.options,
                node,
            }),
        ]
    },

    renderText({ node }) {
        return this.options.renderLabel({
            options: this.options,
            node,
        })
    },

    addKeyboardShortcuts() {
        return {
            Backspace: () => this.editor.commands.command(({ tr, state }) => {
                let isMention = false
                const { selection } = state
                const { empty, anchor } = selection

                if (!empty) {
                    return false
                }

                state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
                    if (node.type.name === this.name) {
                        isMention = true
                        tr.insertText(this.options.suggestion.char || '', pos, pos + node.nodeSize)

                        return false
                    }
                })

                return isMention
            }),
        }
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ]
    },
})
