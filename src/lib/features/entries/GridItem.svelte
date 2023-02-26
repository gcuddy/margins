<!-- 270 x 160 -->
<script lang="ts">
	import { page } from "$app/stores";
	import { DocumentType, Entry } from "@prisma/client";
	export let item: Entry;
	export let showTitle = true;
	// or an annotation...
	$: imgsrc = item.type === DocumentType.tweet ? "/images/twitter.png" : item?.image ? item?.image : "";
</script>

<!-- h-64 -->
<a href="/u:{$page.data.user?.username}/entry/{item.id}" class=" flex w-40 flex-col p-1 space-y-2">
	<img
		class=" h-full w-full  shrink-0 cursor-pointer rounded-md object-cover shadow-sm drop-shadow-xl  ring-1 ring-border/50 hover:ring-1"
		src={imgsrc}
		alt=""
	/>
	{#if showTitle}
		<div class="flex flex-col shrink-0 text-center text-xs">
			<div class="truncate">{item.title}</div>
			<div class="truncate">{item.author}</div>
		</div>
	{/if}
</a>
