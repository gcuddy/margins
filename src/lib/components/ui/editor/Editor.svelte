<script lang="ts">
	import { onMount } from 'svelte';
	import { createEditor, Editor, EditorContent } from 'svelte-tiptap';
	import type { Readable } from 'svelte/store';
	import { TiptapExtensions } from './extensions';
	import { TiptapEditorProps } from './props';
	import BubbleMenu from './BubbleMenu.svelte';

	let editor: Readable<Editor>;

	onMount(() => {
		editor = createEditor({
			extensions: TiptapExtensions,
			editorProps: TiptapEditorProps,
			onUpdate: (e) => {
				// TODO
			},
			autofocus: 'end'
		});
	});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	on:click={() => {
		$editor?.chain().focus().run();
	}}
	class="relative min-h-[500px] w-full max-w-screen-lg border-stone-200 p-12 px-8 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg"
>
	<!--  -->
	<!-- <div class="absolute right-5 top-5 mb-5 rounded-lg bg-stone-100 px-2 py-1 text-sm text-stone-400">
	{saveStatus}
  </div> -->

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
