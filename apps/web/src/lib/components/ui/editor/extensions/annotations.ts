// import { query, type QueryOutput } from "$lib/queries/query";
import { Extension, type Editor, type Range } from "@tiptap/core";
import Suggestion, { type SuggestionProps } from "@tiptap/suggestion";

import Annotations__SvelteComponent_ from "./Annotations.svelte";

import { page } from "$app/stores";
import { recents } from "$lib/stores/recents";
import { PluginKey } from "@tiptap/pm/state";
import type { ComponentType } from "svelte";
import { get, writable } from "svelte/store";
import { query, type QueryOutput } from "$lib/queries/query";


interface CommandItemProps {
    title: string;
    description: string;
    icon: ComponentType;
}

interface CommandProps {
    editor: Editor;
    range: Range;
}

const Command = Extension.create({
    name: 'annotation-suggester',
    addOptions() {
        return {
            suggestion: {
                char: "@",
                allowSpaces: true,
                decorationClass: 'annotation-suggester',
                pluginKey: new PluginKey("annotation-suggester"),
                command: ({
                    editor,
                    range,
                    props,
                }: {
                    editor: Editor;
                    range: Range;
                    props: QueryOutput<"search">[number];
                }) => {
                    console.log({ editor, range, props })
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
                                type: "annotationExtension",
                                attrs: {
                                    id: props.id /*getId(props)*/
                                }
                            }
                        ])
                        .run()

                    window.getSelection()?.collapseToEnd()

                    // props.command({ editor, range });
                },
            },
        };
    },
    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ];
    },
});

const loading = writable(false);

const getSuggestionItems = async ({ query: q }: { query: string }) => {

    if (q.length === 0) {
        // suggest recents
        const items = get(recents);
        return items.entries;
    }
    if (q.length < 2) {
        return [];
    }
    console.log('loading');
    loading.set(true);
    const p = get(page);
    const items = await query(p, 'searchNotes', { q });
    loading.set(false);
    console.log('done');
    return items;
};


const renderItems = () => {
    let component: Annotations__SvelteComponent_;
    const popup: any | null = null;

    return {
        onStart: (props: SuggestionProps) => {
            component = new Annotations__SvelteComponent_({
                target: document.body,
                props: {
                    ...props,
                    loading
                },
            });

        },
        onUpdate: (props: { editor: Editor; clientRect: DOMRect; query: string; items: unknown[]; }) => {
            component?.$$set?.({ ...props, loading });

            popup &&
                popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                });
        },
        onKeyDown: (props: { event: KeyboardEvent }) => {
            if (props.event.key === "Escape") {
                popup?.[0].hide();

                return true;
            }

            // return component?.ref?.onKeyDown(props);
        },
        onExit: () => {
            popup?.[0].destroy();
            component?.$destroy();
        },
    };
};

const AnnotationCommand = Command.configure({
    suggestion: {
        // TODO: debounce
        items: getSuggestionItems,
        render: renderItems,
    },
});

export default AnnotationCommand;