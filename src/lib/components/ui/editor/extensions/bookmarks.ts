import { type Editor, type Range, Extension } from "@tiptap/core";
import Suggestion, { type SuggestionProps } from "@tiptap/suggestion";
import tippy from "tippy.js";
import { type QueryOutput, query } from "$lib/queries/query";

import Bookmarks__SvelteComponent_ from "./Bookmarks.svelte";

import {
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    MessageSquarePlus,
    Text,
    TextQuote,
    Image as ImageIcon,
    Code,
    CheckSquare,
} from "lucide-svelte";
import type { ComponentType } from "svelte";
import { createPopperActions } from "svelte-popperjs";
import { page } from "$app/stores";
import { get, writable } from "svelte/store";
import { PluginKey } from "@tiptap/pm/state";
import { getId } from "$lib/utils/entries";
import { recents } from "$lib/stores/recents";


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
    name: 'bookmarks-inline-command',
    addOptions() {
        return {
            suggestion: {
                char: "[[",
                allowSpaces: true,
                decorationClass: 'bookmark-suggester',
                pluginKey: new PluginKey("bookmarks-inline-command"),
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
                            // {
                            //     type: this.name,
                            //     attrs: props,
                            // },
                            // {
                            //     type: 'text',
                            //     text: props.title,
                            // },
                            {
                                type: "svelteCounterComponent",
                                attrs: {
                                    title: props.title,
                                    type: props.type,
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
    const items = await query(p, 'search_titles', { q });
    loading.set(false);
    console.log('done');
    return items;
};


const renderItems = () => {
    let component: Bookmarks__SvelteComponent_;
    const popup: any | null = null;

    return {
        onStart: (props: SuggestionProps) => {
            component = new Bookmarks__SvelteComponent_({
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

const BookmarkCommand = Command.configure({
    suggestion: {
        // TODO: debounce
        items: getSuggestionItems,
        render: renderItems,
    },
});

export default BookmarkCommand;