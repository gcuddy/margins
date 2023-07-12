
import { Node, mergeAttributes } from '@tiptap/core';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import YoutubeTimestamp from './youtube-timestamp/YoutubeTimestamp.svelte';

export const YoutubeTimestampNode = Node.create({
    name: 'youtubeTimestamp',
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
            youtube_id: {
                default: null,
            },
            title: {
                default: null
            }
        };
    },

    parseHTML() {
        return [{ tag: 'youtube-timestamp' }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['youtube-timestamp', mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return SvelteNodeViewRenderer(YoutubeTimestamp);
    },
});