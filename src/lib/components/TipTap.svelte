<script lang="ts" context="module">
	import { generateHTML } from "@tiptap/html";

	export function genHtml(doc: JSONContent) {
		return generateHTML(doc, [StarterKit, Mention, Link, Image]);
	}
</script>

<script lang="ts">
	import { getEntriesFromCache, searchEntriesQuery } from "$lib/features/entries/queries";
	import { useQueryClient } from "@tanstack/svelte-query";
	import type { EditorOptions, Extensions, JSONContent } from "@tiptap/core";
	import { createEditor, Editor, EditorContent, BubbleMenu } from "svelte-tiptap";
	import Image from "@tiptap/extension-image";
	import { Mention } from "$lib/tiptap/LinkMention";
	// import Mention from "@tiptap/extension-mention";
	import Link from "@tiptap/extension-link";
	import Placeholder from "@tiptap/extension-placeholder";
	import StarterKit from "@tiptap/starter-kit";
	import cx from "classnames";

	// import BubbleMenu from "@tiptap/extension-bubble-menu";

	import { createEventDispatcher, onDestroy, onMount } from "svelte";
	import { get, Readable, writable } from "svelte/store";
	import MentionList, { type State as MentionListState } from "./TipTap/MentionList.svelte";
	import { browser } from "$app/environment";
	import Icon from "./helpers/Icon.svelte";

	let element: Element;
	let editor: Readable<Editor>;

	let saved = "";
	export let config: Partial<EditorOptions> = {};
	export let placeholder = "Write something...";

	export let focusRing = true;

	// Read-only variable to bind to
	export let editing = false;

	let c = "";
	export { c as class };

	interface $$Props {
		config?: Partial<EditorOptions>;
		placeholder?: string;
		focusRing?: boolean;
		editing?: boolean;
		class?: string;
	}

	const queryClient = useQueryClient();

	let mention_query = "";

	const dispatch = createEventDispatcher<{
		update: JSONContent;
		blur: JSONContent;
	}>();

	onMount(() => {
		editor = createEditor({
			content: "<p>Hello World! 🌍️ </p>",
			...config,
			// element: element,
			extensions: [
				StarterKit,
				Image,
				Placeholder.configure({
					placeholder,
					showOnlyWhenEditable: false,
				}),
				Link,
				// BubbleMenu.configure({
				// 	element: bubble,
				// }),
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
								return {
                                    id: entry.id,
                                    label: entry.title
                                };
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
								const setItems = (items: {id: string|number; label: string;}[]) => {
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
										props?.command(item);
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
				attributes: () => ({
					class:
						cx("m-1 p-4 rounded-md prose mx-auto prose-sm sm:prose relative", {
							"shadow ring-1 ring-accent": $editor?.isEditable && focusRing,
						}) +
						" " +
						c,
				}),
			},
		});
		// debounced auto save on update
		$editor.on("update", ({ editor }) => {
			const json = editor.getJSON();
			dispatch("update", json);
			if (saved !== JSON.stringify(json) && !bubble) {
				console.log("saving");
			}
			saved = JSON.stringify(editor.getJSON());
		});
		$editor.on("blur", ({ editor }) => {
			console.log({ bubble });
			if (browser && !document?.body.contains(bubble)) {
				dispatch("blur", editor.getJSON());
			}
			// editor.setEditable(false);
		});
	});

	// onDestroy(() => {
	// 	if (editor) {
	// 		editor.destroy();
	// 	}
	// });

	let bubble: HTMLElement;

	const toggleBold = () => {
		$editor.chain().focus().toggleBold().run();
	};
	const toggleItalic = () => {
		$editor.chain().focus().toggleItalic().run();
	};
	const setLink = (href: string) => $editor.chain().focus().setLink({ href }).run();
	$: isActive = (name: string, attrs = {}) => $editor.isActive(name, attrs);
	$: console.log({ $editor });

	const conditionallySetEditable = (editable: boolean) => {
		if (editable) {
			$editor?.setEditable(true);
			editing = true;
		} else if (browser && !document?.body.contains(bubble)) {
			$editor?.setEditable(false);
			editing = false;
		}
	};

	$: $editor?.isFocused ? conditionallySetEditable(true) : conditionallySetEditable(false);

	let linkMenu = {
		active: false,
		href: "",
	};
</script>

<!-- <div bind:this={element} /> -->
{#if editor}
	<BubbleMenu editor={$editor} pluginKey="formatting">
		<div
			bind:this={bubble}
			class="rounded border border-border bg-elevation shadow-md transition transparency:bg-elevation/50 transparency:backdrop-blur-md transparency:backdrop-brightness-75 transparency:backdrop-contrast-75 transparency:backdrop-saturate-200"
		>
			{#if !linkMenu.active}
				<div class="flex items-center space-x-1 py-1 px-2">
					<button
						on:click={toggleBold}
						class:active={isActive("bold")}
						class={cx("flex h-7 w-7 items-center justify-center rounded")}
					>
						<!-- remix icon -->
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4"
							><path fill="none" d="M0 0h24v24H0z" /><path
								fill="currentColor"
								d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8z"
							/></svg
						>
					</button>
					<button
						on:click={toggleItalic}
						class:active={isActive("italic")}
						class={cx("flex h-7 w-7 items-center justify-center rounded")}
					>
						<!-- remix icon -->
						<svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
							><path fill="none" d="M0 0h24v24H0z" /><path
								d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15z"
								fill="currentColor"
							/></svg
						>
					</button>
					<button
						on:click={() => {
							linkMenu.active = true;
							const url = $editor.getAttributes("link").href;
							console.log({ url });
							if (url) {
								linkMenu.href = url;
							}
						}}
						class:active={isActive("link")}
						class={cx("flex h-7 w-7 items-center justify-center rounded")}
					>
						<!-- remix icon -->
						<Icon name="linkMini" className="h-4 w-4 fill-current" />
					</button>
				</div>
			{:else if linkMenu.active}
				<div class="flex items-center justify-between p-1">
					<input
						placeholder="Enter link"
						autocorrect="false"
						class={cx(
							"h-7 flex-1 border-0 bg-transparent py-1.5 px-3 text-xs outline-none  focus:outline-none focus:ring-0 focus-visible:border-none"
						)}
						type="text"
						autofocus
						bind:value={linkMenu.href}
						on:blur={() => {
							linkMenu = { ...linkMenu, active: false };
						}}
						on:keydown={(event) => {
							if (event.key === "Enter") {
								setLink(linkMenu.href);
								linkMenu = {
									active: false,
									href: "",
								};
							}
						}}
					/>
					<button
						class="inline-flex flex-col items-center"
						on:click={() => {
							$editor.chain().focus().unsetLink().run();
							linkMenu = {
								active: false,
								href: "",
							};
						}}
					>
						<Icon name="trashMini" className="h-4 w-4 fill-muted" />
					</button>
				</div>
			{/if}
		</div>
	</BubbleMenu>
{/if}
<EditorContent editor={$editor} />

<style lang="postcss">
	button.active {
		@apply bg-elevation-hover text-bright;
	}
	:global(.ProseMirror p.is-editor-empty:first-child::before) {
		@apply text-muted/50;
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}
	:global(.ProseMirror.ProseMirror-focused) {
		@apply shadow-none focus-visible:outline-none;
	}
</style>
