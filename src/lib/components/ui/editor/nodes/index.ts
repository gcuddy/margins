
import { Node, mergeAttributes } from '@tiptap/core';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import Timestamp from './timestamp/Timestamp.svelte';

export const TimestampNode = Node.create({
    name: 'timestamp',
    group: 'inline',
    atom: true,
    inline: true,
    selectable: true,

    addAttributes() {
        return {
            timestamp: {
                default: null,
            },
            entry_id: {
                default: null,
            },
            pindex_id: {
                default: null,
            },
            youtube_id: {
                default: null,
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
    },
});