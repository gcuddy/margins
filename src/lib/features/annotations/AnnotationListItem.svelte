<script lang="ts">
	import { page } from "$app/stores";
	import ChosenIcon from "$lib/components/ChosenIcon.svelte";
	import { Annotation, AnnotationType } from "@prisma/client";

	export let annotation: Annotation;

</script>

{#if annotation.type === AnnotationType.document}

    <ChosenIcon chosenIcon={annotation.chosenIcon || {
        type: "icon",
        name: "document",
        color: "red",
    }} />
	<a
		href="/u:{$page.data.user?.username}/annotations/{annotation.id}"
		class="item relative flex h-full flex-initial items-center gap-4  p-4  transition"
	>
        {annotation.title || "Untitled"}
    </a>
{:else}{/if}
