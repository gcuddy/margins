<script lang="ts">
	import { H1 } from "$lib/components/ui/typography";
	import type { PageData } from "./$types";
	export let data: PageData;
</script>

<H1>{data.entry.title}</H1>

Annotations: {data.entry.annotations.length}
Collections: {data.entry.collections.length}
Relations: {data.entry.relations.length}
Bookmark: {JSON.stringify(data.entry.bookmark)}

<div class="prose prose-slate">
	{@html data.entry.html}
</div>
