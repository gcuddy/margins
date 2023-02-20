<script lang="ts">
	import { page } from "$app/stores";
	import { Annotation, AnnotationType } from "@prisma/client";

	export let annotation: Annotation;

</script>

{#if annotation.type === AnnotationType.document}
	<a
		href="/u:{$page.data.user?.username}/annotations/{annotation.id}"
		class="item relative flex h-full flex-initial items-center gap-4  p-4  transition"
	>
        {annotation.title || "Untitled"}
    </a>
{:else}{/if}
