
import { Node, mergeAttributes } from '@tiptap/core';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import Annotation from './Annotation.svelte';

export const AnnotationExtension = Node.create({
    name: 'annotationExtension',
    group: 'block',
    atom: true,
    inline: false,
    selectable: true,
    draggable: true,

    addAttributes() {
        return {
            id: {
                default: null,
            }
        };
    },

    parseHTML() {
        return [{ tag: 'annotation' }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['annotation', mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return SvelteNodeViewRenderer(Annotation);
    },
});