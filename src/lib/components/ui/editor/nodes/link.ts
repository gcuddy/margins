
import { Node, mergeAttributes } from '@tiptap/core';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import CounterComponent from './Counter.svelte';

export const SvelteCounterExtension = Node.create({
    name: 'svelteCounterComponent',
    group: 'inline',
    atom: true,
    inline: true,
    selectable: true,

    addAttributes() {
        return {
            title: {
                default: null,
            },
            type: {
                default: null,
            },
            id: {
                default: null,
            }
        };
    },

    parseHTML() {
        return [{ tag: 'svelte-counter-component' }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['svelte-counter-component', mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return SvelteNodeViewRenderer(CounterComponent);
    },
});
