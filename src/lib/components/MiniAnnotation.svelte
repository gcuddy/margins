<script lang="ts">
	import dayjs from "$lib/dayjs";
	import { createRelativeDateStore } from "$lib/stores/relativeDate";

	import Muted from "./atoms/Muted.svelte";
	import Icon from "./helpers/Icon.svelte";
	import { genHtml } from "./TipTap.svelte";
	export let annotation: RouterOutputs["entries"]["getAnnotations"][number];

	export let clamp = "line-clamp-2";
	let c = "";
	export { c as class };

	$: date = createRelativeDateStore(annotation.createdAt);
</script>

<div
	class="flex flex-col gap-1 rounded-lg border border-border bg-elevation/90 px-2 py-2 text-xs {c}"
>
	<div class="flex items-center gap-2">
		<div>
			<span class="font-medium text-muted"
				><a on:click|stopPropagation href="/u:{annotation.username}"
					>{annotation.username}</a
				></span
			>
			<Muted class="text-xs">
				<time datetime={dayjs(annotation.createdAt).format()}>{$date}</time>
				{annotation.editedAt ? "(edited)" : ""}
			</Muted>
		</div>
		<div class="flex items-center gap-1">
			<Icon
				name={annotation.private ? "lockClosedMini" : "lockOpenMini"}
				className="h-3 w-3 fill-muted/50"
			/>
		</div>
	</div>
	<div
		class=""
		style:--annotation-color={annotation.color || `rgb(252 211 77)`}
	>
		{#if annotation.target}
			{#if annotation.target.selector?.type === "TextQuoteSelector"}
				<div
					class="prose border-l border-[var(--annotation-color)] px-3 text-xs line-clamp-2"
				>
					<p>{annotation.target.selector?.exact}</p>
				</div>
			{/if}
		{/if}
		{#if annotation.body}
			<div class="font-normal {clamp}">{annotation.body}</div>
		{:else if annotation.contentData}
			<div class="font-normal {clamp}">
				{@html genHtml(annotation.contentData)}
			</div>
		{/if}
	</div>
</div>
