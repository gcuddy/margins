<script lang="ts">
	import { Writable, derived } from 'svelte/store';
	import * as selections from './selection';
	import { scale } from 'svelte/transition';
	import AnnotationForm from '$lib/components/AnnotationForm.svelte';
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import { EditIcon, Highlighter } from 'lucide-svelte';
	import { Muted } from '$lib/components/ui/typography';
	import { createEventDispatcher } from 'svelte';
	import type { Annotation } from '$lib/annotation';
	// import { elementReady } from '$lib/utils/dom';

	const { selection, popperContent, mouse_down } = selections.setup();

	type AnnotationEvent = {
		form: Writable<Annotation>;
		el: HTMLFormElement;	
	}
   
    const dispatch = createEventDispatcher<{
		highlight: AnnotationEvent;
		annotate: AnnotationEvent;
	}>();

	const show_tooltip = derived(selection, ($selection) => {
		if (!$selection || !$selection.rangeCount || $selection.isCollapsed) return false;
		const range = $selection.getRangeAt(0);
		const parent = range.commonAncestorContainer.parentElement;
		if (!parent) return false;
		if (!parent.closest('#article')) return false;
		if (
			range.startContainer.parentElement?.closest('[data-annotation-id]') ||
			range.endContainer.parentElement?.closest('[data-annotation-id]')
		)
			return false;
		const text = range.toString();
		return text.length > 0;
	});
</script>

{#if $show_tooltip}
	<div
		use:popperContent
		class="{$mouse_down ? 'pointer-events-none' : 'pointer-events-auto-'} z-10 select-none"
	>
		<div
			class=" z-50 w-auto select-none rounded-md border bg-popover p-1 shadow-md outline-none"
			in:scale={{
				delay: 50,
				start: 0.9
			}}
		>
			<div class="flex justify-between space-x-2">
				<AnnotationForm
					class="contents"
					data={$page.data.annotationForm}
					entry={$page.data.entry}
					footer={false}
				>
					<svelte:fragment slot="content" let:form let:el>
						<Button
							on:pointerdown={() => dispatch('highlight', { form, el })}
							type="submit"
							class="flex h-auto flex-col space-y-1"
							variant="ghost"
						>
							<Highlighter class="h-5 w-5" />
							<Muted class="text-xs">Highlight</Muted>
						</Button>
					</svelte:fragment>
				</AnnotationForm>
				<Button
					on:pointerdown={() => dispatch('annotate')}
					variant="ghost"
					class="flex h-auto flex-col space-y-1"
				>
					<EditIcon class="h-5 w-5" />
					<Muted class="text-xs">Annotate</Muted>
				</Button>
			</div>
		</div>
	</div>
{/if}
