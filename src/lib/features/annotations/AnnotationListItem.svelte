<script lang="ts">
	import { page } from "$app/stores";
	import ChosenIcon from "$lib/components/ChosenIcon.svelte";
	import { Annotation, AnnotationType } from "@prisma/client";
    import dayjs from "$lib/dayjs";
	import Muted from "$lib/components/atoms/Muted.svelte";
	export let annotation: Annotation;
	export let padding = true;
</script>

{#if annotation.type === AnnotationType.document}
	<a
		href="/u:{$page.data.user?.username}/annotations/{annotation.id}"
		class="item relative flex h-full flex-initial items-center gap-4 bg-elevation p-4 ring-1 ring-border/10 transition"
	>
		<div class="h-16 w-14 flex items-center justify-center">
			<ChosenIcon
                class="h-7 w-7 fill-current text-2xl text-center"
				chosenIcon={annotation.chosenIcon || {
					type: "icon",
					name: "document",
					color: "red",
				}}
			/>
		</div>
		<div class="flex flex-col">
			<span class="font-medium">
				{annotation.title || "Untitled"}
			</span>
			<Muted class="text-sm">updated {dayjs(annotation.updatedAt).fromNow()}</Muted>
		</div>
	</a>
{:else}{/if}
