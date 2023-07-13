
import { Node, mergeAttributes } from '@tiptap/core';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import Timestamp from './timestamp/Timestamp.svelte';
import Srs from './srs/SRS.svelte';

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
            count: {
                default: 0
            }
        }
    },

    parseHTML() {
        return [{ tag: 'srs-component' }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['srs-component', mergeAttributes(HTMLAttributes), 0];
    },

    addNodeView() {
        return SvelteNodeViewRenderer(Srs);
    }
})