<script lang="ts">
	import dayjs from "$lib/dayjs";
	import type { BaseAnnotation, ContextualAnnotation } from "$lib/prisma/selects/annotations";
	import { createRelativeDateStore } from "$lib/stores/relativeDate";
	import type { RouterOutputs } from "$lib/trpc/router";
	import Muted from "./atoms/Muted.svelte";
	import SmallPlus from "./atoms/SmallPlus.svelte";
	import Icon from "./helpers/Icon.svelte";
	import { genHtml } from "./TipTap.svelte";
	export let annotation: BaseAnnotation;

    export let clamp = "line-clamp-2";
    let c = "";
    export { c as class };

	$: date = createRelativeDateStore(annotation.createdAt);
</script>

<div class="flex flex-col gap-1 text-xs bg-elevation/90 px-2 py-2 rounded-lg border border-border {c}">
	<div class="flex items-center gap-2">
		<div>
			<span class="text-muted font-medium"
				><a on:click|stopPropagation href="/u:{annotation.creator.username}">{annotation.creator.username}</a
				></span
			>
			<Muted class="text-xs">
				<time datetime={dayjs(annotation.createdAt).format()}>{$date}</time>
				{annotation.editedAt ? "(edited)" : ""}
			</Muted>
		</div>
		<div class="flex items-center gap-1">
			<Icon name={annotation.private ? "lockClosedMini" : "lockOpenMini"} className="h-3 w-3 fill-muted/50" />
		</div>
	</div>
	<div class="">
		{#if annotation.body}
			<div class="font-normal {clamp}">{annotation.body}</div>
		{:else if annotation.contentData}
			<div class="font-normal {clamp}">
				{@html genHtml(annotation.contentData)}
			</div>
		{/if}
	</div>
</div>
