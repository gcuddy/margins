<script lang="ts">
	import { getEntriesFromCache, searchEntriesQuery } from "$lib/features/entries/queries";
	import { useQueryClient } from "@tanstack/svelte-query";
	import { Editor, EditorOptions, JSONContent } from "@tiptap/core";
	import Image from "@tiptap/extension-image";
	import Mention from "@tiptap/extension-mention";
	import Link from "@tiptap/extension-link";
	import Placeholder from "@tiptap/extension-placeholder";
	import StarterKit from "@tiptap/starter-kit";
	import BubbleMenu from "@tiptap/extension-bubble-menu";

	import { createEventDispatcher, onDestroy, onMount } from "svelte";
	import { get, writable } from "svelte/store";
	import MentionList, { type State as MentionListState } from "./TipTap/MentionList.svelte";

	let element: Element;
	let editor: Editor;

	let saved = "";
	export let config: Partial<EditorOptions> = {};
	export let placeholder = "Write something...";
	interface $$Props {
		config?: Partial<EditorOptions>;
		placeholder?: string;
	}

	const queryClient = useQueryClient();

	let mention_query = "";

	const dispatch = createEventDispatcher<{
		update: JSONContent;
		blur: JSONContent;
	}>();

	onMount(() => {
		editor = new Editor({
			content: "<p>Hello World! 🌍️ </p>",
			...config,
			element: element,
			extensions: [
				StarterKit,
				Image,
				Placeholder.configure({
					placeholder,
					showOnlyWhenEditable: false,
				}),
				Link,
				BubbleMenu.configure({
					element: bubble,
				}),
				Mention.configure({
					HTMLAttributes: {
						class: "mention",
						href: "#",
					},
					// suggestion,
					renderLabel({ options, node }) {
						console.log("renderLabel", options, node);
						return `${node.attrs.label ?? node.attrs.id}`;
					},
					suggestion: {
						items: async ({ query }) => {
							// search entries
							const cachedEntries = getEntriesFromCache(queryClient);
							console.log({ cachedEntries });
							if (!query) {
								return cachedEntries.map((entry) => {
									return entry.title;
								});
							}
							const entries = await queryClient.ensureQueryData({
								...searchEntriesQuery({ query }),
								// initialData: cachedEntries.filter((entry) => entry?.title?.toLowerCase().startsWith(query.toLowerCase()))
								// pl: cachedEntries.filter
							});
							return entries.map((entry) => {
								return entry.title;
							});
							// return ["Tom", "Mary", "Joseph"]
							// 	.filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
							// 	.slice(0, 5);
						},
						char: "#",
						decorationTag: "a",
						render: () => {
							let component: MentionList;
							//store.dispatch("onKeydown");
							// REVIEW: this is a hack-y way to get the keyboard event to the child component
							// TODO: support selectItem
							const createState = () => {
								const store = writable<MentionListState>({
									index: 0,
									items: [],
								});
								const up = () => {
									store.update((state) => {
										return {
											...state,
											index: (state.index + state.items.length - 1) % state.items.length,
										};
									});
								};
								const down = () => {
									store.update((state) => {
										return {
											...state,
											index: (state.index + 1) % state.items.length,
										};
									});
								};
								const setItems = (items: string[]) => {
									store.update((state) => {
										return {
											...state,
											items,
											index: 0,
										};
									});
								};
								const selectItem = (idx?: number) => {
									const { index, items, props } = get(store);
									const item = items[idx ?? index];
									if (item) {
										props?.command({ id: item });
									}
								};
								const setProps = (props: any) => {
									store.update((state) => {
										return {
											...state,
											props,
										};
									});
								};
								return {
									...store,
									up,
									down,
									setItems,
									setProps,
									selectItem,
								};
							};
							const state = createState();

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
					},
				}),
			],
			editorProps: {
				attributes: {
					class: `prose mx-auto prose-sm sm:prose p-4 m-1 rounded-md`,
				},
			},
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			},
		});
		// debounced auto save on update
		editor.on("update", () => {
			const json = editor.getJSON();
			if (saved !== JSON.stringify(json)) {
				console.log("saving");
				dispatch("update", json);
			}
			saved = JSON.stringify(editor.getJSON());
		});
		editor.on("blur", ({ editor }) => {
			dispatch("blur", editor.getJSON());
			// editor.setEditable(false);
		});
		// editor.on("focus", ({ editor }) => {
		// 	editor.setEditable(true);
		// });
	});

	$: editor?.isFocused ? editor.setEditable(true) : editor?.setEditable(false);

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	let bubble: HTMLElement;
</script>

<div bind:this={bubble} class="flex">
	<button
		on:click={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
		class:active={editor?.isActive("heading", { level: 1 })}
	>
		H1
	</button>
	<button
		on:click={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
		class:active={editor?.isActive("heading", { level: 2 })}
	>
		H2
	</button>
	<button
		on:click={() => editor?.chain().focus().setParagraph().run()}
		class:active={editor?.isActive("paragraph")}
	>
		P
	</button>
	<button
		on:click={() => {
			const url = window.prompt("Image URL");
			if (!url) return;
			editor
				?.chain()
				.focus()
				.setImage({
					src: url,
				})
				.run();
		}}>Image</button
	>
</div>

<div bind:this={element} />

<style lang="postcss">
	button.active {
		background: black;
		color: white;
	}
	:global(.ProseMirror p.is-editor-empty:first-child::before) {
		@apply text-muted;
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}
	:global(.ProseMirror.ProseMirror-focused) {
		@apply shadow ring-1 ring-accent focus-visible:outline-none;
	}
</style>
