<script lang="ts" context="module">
	export type SaveStatus = 'Saved' | 'Saving...' | 'Unsaved' | null;
</script>

<script lang="ts">
	import { createEventDispatcher, onMount, setContext } from 'svelte';
	import type { EditorOptions, JSONContent, Editor as TEditor } from '@tiptap/core';
	import { createEditor, Editor, EditorContent } from 'svelte-tiptap';
	import { writable, type Readable } from 'svelte/store';
	import { generate_tiptap_extensions, TiptapExtensionProps } from './extensions';
	import { TiptapEditorProps } from './props';
	import BubbleMenu from './BubbleMenu.svelte';
	import debounce from 'just-debounce-it';
	import { persisted } from 'svelte-local-storage-store';
	import { cn } from '$lib/utils/tailwind';
	import { toast } from 'svelte-sonner';
	import { MutationInput, mutation } from '$lib/queries/query';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { badgeVariants } from '../Badge.svelte';
	import type { Transaction } from '@tiptap/pm/state';
	import { save_srs_nodes } from './utils';

	export let id: string | number | undefined = undefined;

	export let context: unknown | undefined = undefined;
	export let options: Partial<EditorOptions> = {};
	export let readonly = false;

	let className = '';
	export { className as class };

	let editor: Readable<Editor>;

	export let save_status = writable<SaveStatus>(null);
	export let onUpdate: EditorOptions['onUpdate'] | undefined = undefined;

	setContext('editor_context', {
		testing: true
	});

	export let size: 'sm' | 'lg' = 'lg';

	// TODO: make this persist to indexeddb

	/**
	 * Whether to show the save status in the top right. When set to "auto", it will only show after a save.
	 */
	export let showSaveStatus: boolean | 'auto' = false;

	export let extensions: TiptapExtensionProps | undefined = undefined;

	export let content: string | JSONContent | undefined = undefined;
	export let blank = false;
	// const content_store = persisted<any>('editor__content' + (id ?? ''), content);

	const dispatch = createEventDispatcher<{
		save: JSONContent;
		blur: {
			editor: TEditor;
			event: FocusEvent;
			transaction: Transaction;
		};
	}>();

	const debounced_update = debounce(async ({ editor }: { editor: TEditor }) => {
		const json = editor.getJSON();
		// content_store.set(json);
		// onUpdate?.(editor);
		// save_status.set('Saving...');
		// dispatch('save', json);
		// setTimeout(() => {
		// 	save_status.set('Saved');
		// }, 500);
	}, 750);

	export const save = (cb: (json: JSONContent) => void) => {
		if (!editor) return;
		const json = $editor.getJSON();
		cb(json);
	};

	export const saveNote = async (note: MutationInput<'save_note'>) => {
		const contentData = $editor.getJSON();
		console.log({ contentData });
		return mutation($page, 'save_note', {
			...note,
			contentData
		});
	};

	export const saveNoteToEntry = (
		entry: number | { id: number },
		opts?: {
			onSuccess?: () => void;
			hideToast?: boolean;
		}
	) => {
		const contentData = $editor.getJSON();
		const entryId = typeof entry === 'number' ? entry : entry.id;

		if (!opts?.hideToast) {
			toast.promise(
				mutation($page, 'save_note', {
					type: 'note',
					contentData,
					entryId
				}),
				{
					loading: 'Saving...',
					success: ({ id }) => {
						if (opts?.onSuccess) opts.onSuccess();
						return 'Saved!';
					},
					error: 'Failed to save.'
				}
			);
		}
	};

	export const getJSON = () => {
		// if (!editor) {};
		return $editor.getJSON();
	};

	onMount(() => {
		editor = createEditor({
			extensions: generate_tiptap_extensions(extensions, context),
			editorProps: TiptapEditorProps,
			onUpdate: (e) => {
				// TODO
				$save_status = 'Unsaved';
				// const selection = e.editor.state.selection;
				onUpdate?.(e);
				// debounced_update(e);
			},
			content,
			autofocus: 'start',
            editable: false,
			...options
		});
		if (content) hydrated = true;
		$editor.on('blur', (e) => {
			// TODO check if bubble menu is open
            e.editor.setEditable(false);
			save_srs_nodes(e.editor.getJSON());
			dispatch('blur', e);
			console.log({ e });
		});
        $editor.on("focus", (e) => {
            e.editor.setEditable(true);
        })
	});

	// $: if (editor && options.editable && !$editor.isEditable) {
	// 	$editor.setEditable(true);
	// 	$editor.commands.focus();
	// } else if (editor && options.editable === false && $editor.isEditable) {
	// 	$editor.setEditable(false);
	// }

	let hydrated = false;
	// $: if (editor && !blank && content_store && $content_store && !hydrated) {
	// 	// hydrate content from localstorage if not yet hydrated
	// 	console.log('being run');
	// 	$editor.commands.setContent($content_store);
	// 	hydrated = true;
	// }

	let just_saved = false;
	$: if (save_status && $save_status === 'Saved') {
		just_saved = true;
		setTimeout(() => {
			just_saved = false;
		}, 3000);
	}
</script>

<!-- min-h-[500px] -->

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	on:click={(e) => {
        if (e.target instanceof HTMLAnchorElement) return;
		if (!readonly) $editor?.setEditable(true);
		$editor?.chain().focus().run();
	}}
	class={cn(
		// ' w-full max-w-screen-lg sm:mb-[calc(2    0vh)] sm:rounded-lg p-6 ',
		'relative ',
		/* shadcn textarea */ 'min-h-[80px] w-full cursor-text rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        $editor?.isFocused && $editor?.isEditable && 'ring-offset-background ring-2 ring-ring ring-offset-2',
		// 'p-12 px-8  sm:px-12',
		// sm:shadow-lg sm:border
		className
	)}
	data-size={size}
>
	<!--  -->
	{#if showSaveStatus === true || (showSaveStatus === 'auto' && $save_status === 'Saved' && just_saved)}
		<div
			transition:fade={{ duration: 150 }}
			class={cn(
				badgeVariants({
					variant: 'secondary'
				}),
				'absolute right-5 top-5 mb-5 text-muted-foreground font-normal'
			)}
		>
			{showSaveStatus === 'auto' ? 'Changes saved' : $save_status}
		</div>
	{/if}
	<slot name="top" />

	{#if editor}
		<BubbleMenu editor={$editor} />
	{/if}

	<EditorContent editor={$editor} />
</div>

<!-- TODO: make not global -->
<style global>

	.ProseMirror .is-editor-empty:first-child::before {
        @apply text-muted-foreground;
		content: attr(data-placeholder);
		float: left;
		color: #adb5bd;
		pointer-events: none;
		height: 0;
	}
	.ProseMirror .is-empty::before {
        @apply text-muted-foreground;
		content: attr(data-placeholder);
		float: left;
		color: #adb5bd;
		pointer-events: none;
		height: 0;
	}

	.ProseMirror iframe {
		min-height: 600px;
		transition: filter 0.1s ease-in-out;

		&:hover {
			cursor: pointer;
			filter: brightness(90%);
		}
	}

	.ProseMirror-selectednode iframe {
		outline: 3px solid #5abbf7;
		filter: brightness(90%);
	}

	div[data-youtube-video] {
		cursor: move;
		padding-right: 24px;
	}

	/* Custom image styles */

	.ProseMirror img {
		transition: filter 0.1s ease-in-out;

		&:hover {
			cursor: pointer;
			filter: brightness(90%);
		}

		&.ProseMirror-selectednode {
			outline: 3px solid #5abbf7;
			filter: brightness(90%);
		}
	}

	/* Custom TODO list checkboxes – shoutout to this awesome tutorial: https://moderncss.dev/pure-css-custom-checkbox-style/ */

	ul[data-type='taskList'] li > label {
		margin-right: 0.2rem;
		user-select: none;
	}

	@media screen and (max-width: 768px) {
		ul[data-type='taskList'] li > label {
			margin-right: 0.5rem;
		}
	}

	ul[data-type='taskList'] li > label input[type='checkbox'] {
		-webkit-appearance: none;
		appearance: none;
		background-color: #fff;
		margin: 0;
		cursor: pointer;
		width: 1.2em;
		height: 1.2em;
		position: relative;
		top: 5px;
		border: 2px solid black;
		margin-right: 0.3rem;
		display: grid;
		place-content: center;

		&:hover {
			background-color: #f8f9fa;
		}

		&:active {
			background-color: #e9ecef;
		}

		&::before {
			content: '';
			width: 0.65em;
			height: 0.65em;
			transform: scale(0);
			transition: 120ms transform ease-in-out;
			box-shadow: inset 1em 1em;
			transform-origin: center;
			clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
		}

		&:checked::before {
			transform: scale(1);
		}
	}

	ul[data-type='taskList'] li[data-checked='true'] > div > p {
		color: #a8a29e;
		text-decoration: line-through;
		text-decoration-thickness: 2px;
	}

	/* Overwrite tippy-box original max-width */

	.tippy-box {
		max-width: 400px !important;
	}
	.Tiptap-mathematics-editor {
		background: #202020;
		color: #fff;
		font-family: monospace;
		padding: 0.2rem 0.5rem;
	}

	.Tiptap-mathematics-render {
		cursor: pointer;
		padding: 0 0.25rem;
		transition: background 0.2s;

		&:hover {
			background: #eee;
		}
	}

	.Tiptap-mathematics-editor,
	.Tiptap-mathematics-render {
		border-radius: 0.25rem;
		display: inline-block;
	}
</style>
