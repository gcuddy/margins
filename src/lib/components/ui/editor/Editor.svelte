<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { JSONContent, Editor as TEditor } from '@tiptap/core';
	import { createEditor, Editor, EditorContent } from 'svelte-tiptap';
	import { writable, type Readable } from 'svelte/store';
	import { generate_tiptap_extensions, TiptapExtensionProps } from './extensions';
	import { TiptapEditorProps } from './props';
	import BubbleMenu from './BubbleMenu.svelte';
	import debounce from 'just-debounce-it';
	import { persisted } from 'svelte-local-storage-store';
	import { cn } from '$lib/utils/tailwind';

	export let id: string | number | undefined = undefined;
	let className = '';
	export { className as class };

	let editor: Readable<Editor>;

	const save_status = writable('Saved');

    export let size: 'sm' | 'lg' = 'lg';

	// TODO: make this persist to indexeddb

	export let showSaveStatus = false;

    export let extensions: TiptapExtensionProps | undefined = undefined;

	export let content: JSONContent | undefined = undefined;
	const content_store = persisted<any>('editor__content' + (id ?? ''), content);

	const dispatch = createEventDispatcher<{
		save: JSONContent;
	}>();

	const debounced_update = debounce(async ({ editor }: { editor: TEditor }) => {
		const json = editor.getJSON();
		save_status.set('Saving...');
		content_store.set(json);
		dispatch('save', json);
		setTimeout(() => {
			save_status.set('Saved');
		}, 500);
	}, 750);

    export const save = (cb: (json: JSONContent) => void) => {
        if (!editor) return;
        const json = $editor.getJSON();
        cb(json);
    }

	onMount(() => {
		editor = createEditor({
			extensions: generate_tiptap_extensions(extensions),
			editorProps: TiptapEditorProps,
			onUpdate: (e) => {
				// TODO
				$save_status = 'Unsaved';
				// const selection = e.editor.state.selection;
				debounced_update(e);
			},
			autofocus: 'end'
		});
	});

	let hydrated = false;
	$: if (editor && content_store && $content_store && !hydrated) {
		// hydrate content from localstorage if not yet hydrated
		console.log('being run');
		$editor.commands.setContent($content_store);
		hydrated = true;
	}
</script>

<!-- min-h-[500px] -->

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	on:click|self={() => {
		// $editor?.chain().focus().run();
	}}
	class={cn(
		'relative  w-full max-w-screen-lg p-12 px-8 sm:mb-[calc(2    0vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg',
		className
	)}
    data-size={size}
>
	<!--  -->
	{#if showSaveStatus}
		<div
			class="absolute right-5 top-5 mb-5 rounded-lg bg-stone-100 px-2 py-1 text-sm text-stone-400"
		>
			{$save_status}
		</div>
	{/if}

	{#if editor}
		<BubbleMenu editor={$editor} />
	{/if}

	<EditorContent editor={$editor} />
</div>

<style global>
	.ProseMirror .is-editor-empty:first-child::before {
		content: attr(data-placeholder);
		float: left;
		color: #adb5bd;
		pointer-events: none;
		height: 0;
	}
	.ProseMirror .is-empty::before {
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
</style>
