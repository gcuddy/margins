import { type Editor, type Range, Extension } from "@tiptap/core";
import Suggestion, { type SuggestionProps } from "@tiptap/suggestion";
import tippy from "tippy.js";

import SlashCommand__SvelteComponent_ from "./SlashCommand.svelte";

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
    ClockIcon,
} from "lucide-svelte";
import type { ComponentType } from "svelte";
import { createPopperActions } from "svelte-popperjs";
import { handleImageUplaod } from "../utils";
import { get } from "svelte/store";
import { page } from "$app/stores";
import player from "$lib/stores/player";


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
    name: 'slash-command',
    addOptions() {
        return {
            suggestion: {
                char: "/",
                command: ({
                    editor,
                    range,
                    props,
                }: {
                    editor: Editor;
                    range: Range;
                    props: any;
                }) => {
                    props.command({ editor, range });
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
})

const getSuggestionItems = (props: { query: string }) => {
    const { query } = props;
    console.log({ props });

    const $page = get(page);
    const $player = get(player);

    console.log({ pagedata: $page.data });
    // Are we currently in a video?
    const video = $page.data?.entry?.type === 'video' && !!$page.data.entry?.youtubeId;

    const audio = $player?.type === 'audio';

    const items = [
        {
            title: "Text",
            description: "Just start typing with plain text.",
            searchTerms: ["p", "paragraph"],
            icon: Text,
            command: ({ editor, range }: CommandProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleNode("paragraph", "paragraph")
                    .run();
            },
        },
        {
            title: "To-do List",
            description: "Track tasks with a to-do list.",
            searchTerms: ["todo", "task", "list", "check", "checkbox"],
            icon: CheckSquare,
            command: ({ editor, range }: CommandProps) => {
                editor.chain().focus().deleteRange(range).toggleTaskList().run();
            },
        },
        {
            title: "Heading 1",
            description: "Big section heading.",
            searchTerms: ["title", "big", "large", 'h1'],
            icon: Heading1,
            command: ({ editor, range }: CommandProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", { level: 1 })
                    .run();
            },
        },
        {
            title: "Heading 2",
            description: "Medium section heading.",
            searchTerms: ["subtitle", "medium", 'h2'],
            icon: Heading2,
            command: ({ editor, range }: CommandProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", { level: 2 })
                    .run();
            },
        },
        {
            title: "Heading 3",
            description: "Small section heading.",
            searchTerms: ["subtitle", "small", 'h3'],
            icon: Heading3,
            command: ({ editor, range }: CommandProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", { level: 3 })
                    .run();
            },
        },
        {
            title: "Bullet List",
            description: "Create a simple bullet list.",
            searchTerms: ["unordered", "point"],
            icon: List,
            command: ({ editor, range }: CommandProps) => {
                editor.chain().focus().deleteRange(range).toggleBulletList().run();
            },
        },
        {
            title: "Numbered List",
            description: "Create a list with numbering.",
            searchTerms: ["ordered"],
            icon: ListOrdered,
            command: ({ editor, range }: CommandProps) => {
                editor.chain().focus().deleteRange(range).toggleOrderedList().run();
            },
        },
        {
            title: "Quote",
            description: "Capture a quote.",
            searchTerms: ["blockquote"],
            icon: TextQuote,
            command: ({ editor, range }: CommandProps) =>
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleNode("paragraph", "paragraph")
                    .toggleBlockquote()
                    .run(),
        },
        {
            title: "Code",
            description: "Capture a code snippet.",
            searchTerms: ["codeblock"],
            icon: Code,
            command: ({ editor, range }: CommandProps) =>
                editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
        },
        {
            title: "Image",
            description: "Upload an image from your computer.",
            searchTerms: ["photo", "picture", "media"],
            icon: ImageIcon,
            command: ({ editor, range }: CommandProps) => {
                editor.chain().focus().deleteRange(range).run();
                // upload image
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = async (event) => {
                    if (input.files?.length) {
                        const file = input.files[0];
                        return handleImageUplaod(file, editor.view, event);
                    }
                };
                input.click();
            },
        },
    ];

    if (video) {
        items.push({
            title: "Timestamp",
            description: "Capture a timestamp.",
            searchTerms: ["timestamp", "time", "video"],
            icon: ClockIcon,
            command: async ({ editor, range }: CommandProps) => {

                // TODO: get player from page 
                const $player = get(player);
                if ($player && $player.type === "youtube") {
                    console.log('hello')
                    const time = Math.floor(Number(await $player.player.getCurrentTime()));
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
                                type: "timestamp",
                                attrs: {
                                    timestamp: time,
                                    entry_id: $page.data.entry?.id,
                                    youtube_id: $page.data.entry?.youtubeId,
                                    title: $page.data.entry?.title,
                                }
                            }
                        ])
                        .run();
                }
            },
        })
    }

    if (audio) {
        items.push({
            title: "Timestamp",
            description: "Capture a timestamp from the current audio.",
            searchTerms: ["timestamp", "time", "audio"],
            icon: ClockIcon,
            command: async ({ editor, range }: CommandProps) => {
                const $audioPlayer = get($player.player);
                const time = $audioPlayer.state.currentTime;
                editor
                    .chain()
                    .focus()
                    .insertContentAt(range, [
                        {
                            type: "timestamp",
                            attrs: {
                                timestamp: time,
                                entry_id: $audioPlayer.audio?.entry_id,
                                title: $audioPlayer.audio?.title,
                                image: $audioPlayer.audio?.image,
                            }
                        }
                    ])
                    .run();
            }
        })
    }

    return items.filter((item) => {
        if (typeof query === "string" && query.length > 0) {
            const search = query.toLowerCase();
            return (
                item.title.toLowerCase().includes(search) ||
                item.description.toLowerCase().includes(search) ||
                (item.searchTerms &&
                    item.searchTerms.some((term: string) => term.includes(search)))
            );
        }
        return true;
    });
};

export const updateScrollView = (container: HTMLElement, item: HTMLElement) => {
    const containerHeight = container.offsetHeight;
    const itemHeight = item ? item.offsetHeight : 0;

    const top = item.offsetTop;
    const bottom = top + itemHeight;

    if (top < container.scrollTop) {
        container.scrollTop -= container.scrollTop - top + 5;
    } else if (bottom > containerHeight + container.scrollTop) {
        container.scrollTop += bottom - containerHeight - container.scrollTop + 5;
    }
};


const renderItems = () => {
    let component: SlashCommand__SvelteComponent_;
    const popup: any | null = null;


    return {
        onStart: (props: SuggestionProps) => {
            const [ref, content] = createPopperActions({

            });
            const context = new Map();
            ref(document.body);
            context.set('content_action', content)
            component = new SlashCommand__SvelteComponent_({
                target: document.body,
                props,
            });

        },
        onUpdate: (props: { editor: Editor; clientRect: DOMRect }) => {
            component?.$$set?.(props)

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

const SlashCommand = Command.configure({
    suggestion: {
        items: getSuggestionItems,
        render: renderItems,
    },
});

export default SlashCommand;