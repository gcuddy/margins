import { mergeAttributes, Node } from '@tiptap/core'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { PluginKey } from '@tiptap/pm/state'
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion'
import { get } from 'svelte/store'

import { page } from '$app/stores'
import { iconsMini } from '$lib/features/entries/utils'
import { icons } from '$lib/icons'

export type MentionOptions = {
    HTMLAttributes: Record<string, any>
    renderLabel: (props: { options: MentionOptions; node: ProseMirrorNode }) => string
    suggestion: Omit<SuggestionOptions, 'editor'>
}

const createsvg = ({box, svg: icon}: {
    box: number;
    svg: string;
}) => {
    const svg = document.createElement("svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("viewBox", `0 0 ${box} ${box}`);
    svg.setAttribute("fill", "currentColor");
    svg.setAttribute("class", "inline-flex w-4 h-4");
    svg.innerHTML = icon;
    return svg;
}

export const MentionPluginKey = new PluginKey('mention')

export const Mention = Node.create<MentionOptions>({
    name: 'mention',

    addOptions() {
        return {
            HTMLAttributes: {},
            renderLabel({ options, node }) {
                return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
            },
            suggestion: {
                char: '@',
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
                    const user = get(page).data.user;
                    return {
                        'data-id': attributes.id,
                        href: `/u:${user?.username}/entry/${attributes.id}`
                    }
                },
            },

            type: {
                default: null,
                parseHTML: element => element.getAttribute('data-entry-type'),
                renderHTML: attributes => {
                    if (!attributes.type) {
                        return {}
                    }
                    return {
                        'data-entry-type': attributes.type,
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
                tag: `a[data-type="${this.name}"]`,
            },
        ]
    },

    renderHTML({ node, HTMLAttributes, }) {
        console.log({ node });
        const type = node?.attrs?.type;
        console.log({ type });
        const iconName = type ? iconsMini[type] : undefined;
        const icon = iconName ? icons[iconName] : undefined;
       console.log({icon})
        return ['span',
            icon ? createsvg(icon) : '',
            [
                'a',
                mergeAttributes({ 'data-type': this.name }, this.options.HTMLAttributes, HTMLAttributes),
                this.options.renderLabel({
                    options: this.options,
                    node,
                }),
            ]
        ]
        return [
            'a',
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
