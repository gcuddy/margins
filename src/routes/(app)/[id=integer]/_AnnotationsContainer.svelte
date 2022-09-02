<!-- this contains everything related to our annotations on an article -->
<script lang="ts">
	import type { Tooltip } from '$lib/types';
	import { scale } from 'svelte/transition';
	import type { Annotation } from '@prisma/client';
	import { postAnnotation, postHighlight } from './_helpers';
	import { createEventDispatcher } from 'svelte';
	import AnnotationInput from './_AnnotationInput.svelte';
	import { uniqueHighlightElements } from '$lib/stores/misc';
	import scrollY from '$lib/stores/scrollY';
	import AnnotationContainer from '$lib/components/Annotation.svelte';

	export let annotations: Annotation[] = [];
	export let annotationTooltip: Tooltip;
	export let articleID: number;
	export let activeHighlightID: string;
	export let pending_highlight: HighlightBody;

	$: console.log($uniqueHighlightElements);

	const dispatch = createEventDispatcher();

	const saveAnnotation = async ({ detail }) => {
		annotationTooltip.visible = false;
		await postHighlight(articleID, pending_highlight);
		const annotation = await postAnnotation(articleID, detail);
		annotations = [...annotations, annotation];
		dispatch('annotation-saved', annotation);
		pending_highlight = null;
	};

	const cancelAnnotation = () => {
		annotationTooltip.visible = false;
		dispatch('cancel');
	};
</script>

{#if annotationTooltip.visible}
	<div>
		<AnnotationInput
			top={annotationTooltip.top}
			visibility={annotationTooltip.visible ? 'visible' : 'hidden'}
			on:cancel={cancelAnnotation}
			on:save={saveAnnotation}
			{articleID}
			highlightId={activeHighlightID}
		/>
	</div>
{/if}

{#each annotations as annotation}
	<div
		style="position:absolute; top: {$uniqueHighlightElements.find(
			({ id }) => annotation.highlightId === id
		)?.top}px;"
		data-annotation-id={annotation.id}
	>
		<!-- {annotation.text} -->
		<AnnotationContainer text={annotation.text} />
	</div>
{/each}
