<script lang="ts">
	import { onMount } from 'svelte';
	import { createFloatingActions } from 'svelte-floating-ui';
	import type {
		ClientRectObject,
		VirtualElement,
	} from 'svelte-floating-ui/core';
	import { derived, writable } from 'svelte/store';
	import { offset, flip, shift } from 'svelte-floating-ui/dom';
	import AnnotationInlineMenu from './annotation-inline-menu.svelte';
	import { useCreateNoteMutation } from '../data/mutations';
	import { describeTextQuote } from '@margins/annotator';
	import { syncHighlights } from '@margins/annotator/dom';
	import { createId } from '@margins/lib';
	import { useNotesQuery } from '../data/queries';

	export let entryID: string;

	const createNoteMutation = useCreateNoteMutation(entryID);
	const notesQuery = useNotesQuery(entryID);

	const annotations = derived(notesQuery, ($notes) => {
		return $notes.data?.filter((note) => note.type === 'annotation') ?? [];
	});

	$: syncHighlights(document.body, $annotations);

	let show = false;

	async function handleHighlight() {
		const range = window.getSelection()?.getRangeAt(0);
		if (!range) return;
		const textQuote = await describeTextQuote(range);
		// await highlightSelectorTarget(textQuote);

		$createNoteMutation.mutate({
			entryId: entryID,
			id: createId(),
			target: {
				selector: textQuote,
			},
			type: 'annotation',
		});
	}

	function handleSelect() {
		const selection = window.getSelection();
		if (selection && selection.toString().length > 0) {
			const range = selection.getRangeAt(0);
			const rect = range.getBoundingClientRect();
			x = rect.x;
			y = rect.y;
			top = rect.top;
			left = rect.left;
			bottom = rect.bottom;
			right = rect.right;
			width = rect.width;
			height = rect.height;

			el = document.elementFromPoint(rect.x, rect.y);

			show = true;
		} else {
			show = false;
			x = 0;
			y = 0;
		}
	}

	const [floatingRef, floatingContent] = createFloatingActions({
		autoUpdate: false,
		middleware: [offset(6), flip(), shift()],
		placement: 'top',
		strategy: 'absolute',
	});

	let x = 0;
	let y = 0;
	let top = 0;
	let left = 0;
	let bottom = 0;
	let right = 0;
	let width = 0;
	let height = 0;
	let el: Element | null = null;

	$: getBoundingClientRect = (): ClientRectObject => {
		return {
			bottom,
			height,
			left,
			right,
			top,
			width,
			x,
			y,
		};
	};

	const virtualElement = writable<VirtualElement>({
		contextElement: el,
		getBoundingClientRect,
	});

	$: virtualElement.set({ contextElement: el, getBoundingClientRect });

	floatingRef(virtualElement);

	// handle annotations, probably not place to do it but hey.

	onMount(() => {
		document.addEventListener('selectionchange', handleSelect);

		return () => {
			document.removeEventListener('selectionchange', handleSelect);
		};
	});
</script>

{#if show}
	<div id="floating-content" use:floatingContent>
		<div
			class="bg-popover text-popover-foreground z-50 w-fit rounded-lg border shadow-md outline-none"
		>
			<AnnotationInlineMenu onHighlight={handleHighlight} />
		</div>
	</div>
{/if}

<style>
	:global(mark[data-margins-annotation-id]) {
		background-color: rgb(346, 469, 160);
	}
</style>
