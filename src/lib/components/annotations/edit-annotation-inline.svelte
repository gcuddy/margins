<script lang="ts">
	import {
		useEscapeKeydown,
		usePortal,
	} from '@melt-ui/svelte/internal/actions';
	import focusTrap from '$lib/actions/focus-trap';

	import type { ContentAction } from 'svelte-popperjs';
	import { draggable } from '@neodrag/svelte';
	import { cn } from '$lib';

	export let show = false;
	export let contentAction: ContentAction<any>;
	export let contentData: JSONContent = startingContentData;
	$: console.log('editannotationinline - contentData', contentData);
	let className: string | null | undefined = undefined;
	export { className as class };

	let editorEl: HTMLElement;
	let empty = true;
	export let debug = false;

	import Editor from '$components/ui/editor/Editor.svelte';
	import type { JSONContent } from '@tiptap/core';
	import { createEventDispatcher } from 'svelte';
	import { Button } from '$components/ui/button';
	import { flyAndScale } from '$lib/utils';
	import { startingContentData } from '$components/ui/editor/constants';
	import alertDialogStore from '$lib/stores/alert-dialog';

	const dispatch = createEventDispatcher<{
		cancel: void;
		save: { contentData: JSONContent };
	}>();

	function cancel() {
		dispatch('cancel');
	}

	function save() {
		dispatch('save', { contentData });
	}

	let originalContentData = { ...contentData };

	// $: if (!show) {
	//     console.log('resetting')
	// 	contentData = startingContentData;
	// 	copied = false;
	// } else if (show && !copied) {
	//     tick().then(() => {
	//         console.log('copying')
	//         // contentData = { ...contentData };
	//         originalContentData = { ...contentData };
	//         copied = true;
	//     })
	// }

	$: console.log({ contentData, originalContentData });

	let tainted = false;
	$: console.log({ tainted });

	function clickOutsideDeactivates() {
		if (!tainted) {
			cancel();
			return true;
		}
		return false;
	}

	let focusTrapPaused: boolean | undefined = undefined;
</script>

{#if show}
	<div
		use:contentAction
		use:usePortal
		use:focusTrap={{
			allowOutsideClick: true,
			clickOutsideDeactivates,
			escapeDeactivates: true,
			immediate: true,
			initialFocus: () => editorEl,
			paused: focusTrapPaused,
			returnFocusOnDeactivate: false,
		}}
		use:useEscapeKeydown={{
			handler: cancel,
		}}
		class="z-10"
	>
		<!-- use:draggable -->
		<div
			in:flyAndScale={{
				duration: 150,
				start: 0.9,
			}}
			out:flyAndScale
			use:draggable
			class={cn(
				'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
				'flex flex-col gap-y-4 w-80 max-w-xs',
				className,
			)}
		>
			{#if debug}{JSON.stringify(contentData)}{/if}
			<Editor
				bind:empty
				bind:tainted
				bind:el={editorEl}
				alwaysTabbable
				autofocus
				content={contentData}
				focusRing={false}
				class="sm:shadow-none peer shadow-none border-none p-0 min-h-0"
				onUpdate={({ editor }) => {
					contentData = editor.getJSON();
				}}
				extensions={{
					placeholder: 'Write a note...',
				}}
				options={{
					autofocus: 'end',
					onDestroy: () => {
						contentData = startingContentData;
					},
				}}
			/>
			<div class="flex justify-end gap-3">
				<Button
					on:click={() => {
						if (!tainted) {
							cancel();
							return;
						}
						focusTrapPaused = true;
						alertDialogStore.open({
							action: () => {
								focusTrapPaused = false;
								cancel();
							},
							cancel: () => {
								focusTrapPaused = false;
							},
							title: 'Discard changes?',
							description:
								'You have unsaved changes. Are you sure you want to discard them?',
						});
					}}
					size="sm"
					variant="secondary">Cancel</Button
				>
				<Button disabled={!tainted} size="sm" on:click={save}>Save</Button>
			</div>
		</div>
	</div>
{/if}
