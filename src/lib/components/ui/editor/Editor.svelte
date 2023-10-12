<script lang="ts" context="module">
	export type SaveStatus = 'Saved' | 'Saving...' | 'Unsaved' | null;
</script>

<script lang="ts">
	import './editor.css';

	import type {
		Editor as TEditor,
		EditorOptions,
		JSONContent,
		FocusPosition,
	} from '@tiptap/core';
	import type { Transaction } from '@tiptap/pm/state';
	import * as idb from 'idb-keyval';
	import debounce from 'just-debounce-it';
	import { createEventDispatcher, onMount, setContext, tick } from 'svelte';
	import { type Readable, writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { persisted } from 'svelte-local-storage-store';
	import { toast } from 'svelte-sonner';
	import { createEditor, type Editor, EditorContent } from 'svelte-tiptap';

	import { page } from '$app/stores';
	import { mutation, type MutationInput } from '$lib/queries/query';
	import { cn } from '$lib/utils/tailwind';

	import { badgeVariants } from '../badge';
	import BubbleMenu from './BubbleMenu.svelte';
	import {
		generate_tiptap_extensions,
		type TiptapExtensionProps,
	} from './extensions';
	import { TiptapEditorProps } from './props';
	import { save_srs_nodes } from './utils';

	export let id: string | number | undefined = undefined;

	export let context: unknown | undefined = undefined;
	export let options: Partial<EditorOptions> = {};
	export let readonly = false;
    export let alwaysEditable = false;
	export let focusRing = true;
	export let autofocus = false;
	export let el: HTMLElement | undefined = undefined;
	/** If set to true, the tabindex will always be 0. */
	export let alwaysTabbable = false;
	export let showEditor = true;

    export let tainted = false;

	let className = '';
	export { className as class };

	let editor: Readable<Editor>;

	export let save_status = writable<SaveStatus>(null);
	export let onUpdate: EditorOptions['onUpdate'] | undefined = undefined;
	export let onFocus: EditorOptions['onFocus'] | undefined = undefined;
	export let onBlur: EditorOptions['onBlur'] | undefined = undefined;

	setContext('editor_context', {
		testing: true,
	});

	export let size: 'sm' | 'lg' = 'lg';

	// TODO: make this persist to indexeddb

	/**
	 * Whether to show the save status in the top right. When set to "auto", it will only show after a save.
	 */
	export let showSaveStatus: boolean | 'auto' = false;

	export let extensions: TiptapExtensionProps | undefined = undefined;

	export let content: string | JSONContent | undefined | null = undefined;
	// export let blank = false;
	// const content_store = persisted<any>('editor__content' + (id ?? ''), content);

	const dispatch = createEventDispatcher<{
		blur: {
			editor: TEditor;
			event: FocusEvent;
			transaction: Transaction;
		};
		save: JSONContent;
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
		if (!editor) {
			return;
		}
		const json = $editor.getJSON();
		cb(json);
	};

    export const isEmpty = () => $editor.isEmpty
	export const saveNote = async (note: MutationInput<'save_note'>) => {
		const contentData = $editor.getJSON();
		return mutation($page, 'save_note', {
			...note,
			contentData,
		});
	};

	export const saveNoteToEntry = (
		entry: number | { id: number },
		opts?: {
			hideToast?: boolean;
			onSuccess?: () => void;
		},
	) => {
		const contentData = $editor.getJSON();
		const entryId = typeof entry === 'number' ? entry : entry.id;

		if (!opts?.hideToast) {
			toast.promise(
				mutation($page, 'save_note', {
					contentData,
					entryId,
					type: 'note',
				}),
				{
					error: 'Failed to save.',
					loading: 'Saving...',
					success: ({ id }) => {
						if (opts?.onSuccess) {
							opts.onSuccess();
						}
						return 'Saved!';
					},
				},
			);
		}
	};

	export const getJSON = () => {
		// if (!editor) {};
		return $editor.getJSON();
	};

	onMount(() => {
        tainted = false;
		editor = createEditor({
			autofocus: autofocus ? 'start' : undefined,
			content,
			editable: autofocus ? true : false,
			editorProps: TiptapEditorProps,
			extensions: generate_tiptap_extensions(extensions, context),
			onUpdate: (e) => {
				// TODO
				$save_status = 'Unsaved';
                console.log('updating', { e})
                tainted = true;
				// const selection = e.editor.state.selection;
				onUpdate?.(e);
				// debounced_update(e);
			},
			...options,
		});
		if (autofocus) {
			// console.log({ autofocus, $editor });
			// setTimeout(() => {
			// 	console.log(`focus`);
			// 	$editor.commands.focus();
			// }, 2000);
			// tick().then(() =>{
			//     $editor.commands.focus();
			// })
		}
		if (content) {
			hydrated = true;
		}
		$editor.on('blur', (e) => {
            console.log('blur', {e, alwaysEditable})
			// TODO check if bubble menu is open
            if (!alwaysEditable) {
                console.log('setting editable to false')
                e.editor.setEditable(false);
            }
			save_srs_nodes(e.editor.getJSON());
			if (id) {
				idb.set(
					`note_markdown:${id}`,
					e.editor?.storage.markdown.getMarkdown(),
				);
			}
			// TODO we should actually just save this to our db... for now using indexeddb

			onBlur?.(e);
			dispatch('blur', e);
		});
		$editor.on('focus', (e) => {
            console.log('focus', e)
			e.editor.setEditable(true);
			onFocus?.(e);
		});
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

	$: if (!hydrated && content !== undefined && $editor) {
		// $editor.commands.setContent(content);
		hydrated = true;
	}

	export const setContent = (content: string | JSONContent) => {
		$editor.commands.setContent(content);
	};

	let just_saved = false;
	$: if (save_status && $save_status === 'Saved') {
		just_saved = true;
		setTimeout(() => {
			just_saved = false;
		}, 3000);
	}

	let bubbleMenuFocused = false;

    export const focus = (position?: FocusPosition) => {
        console.log()
        $editor.setEditable(true);
        $editor.chain().focus(position).run();
    }
    export const setEditable = (editable: boolean) => {
        $editor.setEditable(editable);
    }
</script>

{#if showEditor && editor && $editor}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div
		data-editor
		bind:this={el}
		data-focused={$editor.isFocused}
		on:click={(e) => {
			if (e.target instanceof HTMLAnchorElement) {
				return;
			}
			if (!readonly) {
				$editor.setEditable(true);
			}
			$editor.chain().focus().run();
		}}
		on:focus|self={() => {
			if (readonly) {
				return;
			}
			$editor.setEditable(true);
			$editor.chain().focus().run();
		}}
		class={cn(
			// ' w-full max-w-screen-lg sm:mb-[calc(2    0vh)] sm:rounded-lg p-6 ',
			'relative ',
			/* shadcn textarea */ 'min-h-[64px] w-full cursor-text rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ring-offset-background ring-ring ring-offset-2',
			focusRing && 'focus-within:ring-2',
			(($editor.isFocused && $editor.isEditable) || bubbleMenuFocused) &&
				focusRing &&
				'ring-2',
			// 'p-12 px-8  sm:px-12',
			// sm:shadow-lg sm:border
			className,
		)}
		tabindex={(readonly || $editor.isFocused) && !alwaysTabbable ? -1 : 0}
		data-size={size}
	>
		{#if showSaveStatus === true || (showSaveStatus === 'auto' && $save_status === 'Saved' && just_saved)}
			<div
				transition:fade={{ duration: 150 }}
				class={cn(
					badgeVariants({
						variant: 'secondary',
					}),
					'absolute right-2 top-2 mb-5 text-muted-foreground bg-secondary/60 font-normal',
				)}
			>
				{showSaveStatus === 'auto' ? 'Changes saved' : $save_status}
			</div>
		{/if}
		<slot name="top" />

		{#if editor}
			<BubbleMenu bind:isFocused={bubbleMenuFocused} editor={$editor} />
		{/if}

		<EditorContent editor={$editor} />
	</div>
{/if}
