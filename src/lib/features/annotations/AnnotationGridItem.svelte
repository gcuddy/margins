<script lang="ts">
	import { page } from "$app/stores";
	import ChosenIcon from "$lib/components/ChosenIcon.svelte";
	import { Annotation, AnnotationType } from "@prisma/client";
	import dayjs from "$lib/dayjs";
	import Muted from "$lib/components/atoms/Muted.svelte";
	import { genHtml } from "$lib/components/TipTap.svelte";
	export let annotation: Annotation;
	export let padding = true;
    import { tw } from 'typewind';
	import classNames from "classnames";

</script>

{#if annotation.type === AnnotationType.document}
	<a
		href="/u:{$page.data.user?.username}/annotations/{annotation.id}"
		class={classNames("item flex-col relative flex h-full flex-initial items-center gap-4 bg-elevation p-4 ring-1 ring-border/10 transition")}
	>
		<!-- <div class="flex h-16 w-14 items-center justify-center">
			<ChosenIcon
				class="h-7 w-7 fill-current text-center text-2xl"
				chosenIcon={annotation.chosenIcon || {
					type: "icon",
					name: "document",
					color: "red",
				}}
			/>
		</div> -->
		<div class="flex flex-col shrink">
			<span class="font-medium">
				{annotation.title || "Untitled"}
			</span>
			<Muted class="text-sm">updated {dayjs(annotation.updatedAt).fromNow()}</Muted>
		</div>
		<div class="flex flex-col shrink">
			<div class="">
				{#if annotation.contentData}
					<!-- //TODO Type -->
					<!-- <div class={classNames("prose line-clamp-4")}> -->
						<!-- {@html genHtml(annotation.contentData)} -->
					<!-- </div> -->
				{:else if annotation.body}
					{@html annotation.body}
				{/if}
			</div>
		</div>
	</a>
{:else}
	<!-- <Annotation /> -->
{/if}
