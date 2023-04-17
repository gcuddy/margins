<script lang="ts">
	import EntryList from "$lib/components/entries/EntryList.svelte";
	import { H1 } from "$lib/components/ui/typography";
	import { TagIcon } from "lucide-svelte";

	export let data;
</script>

<div class="space-y-4">
	<H1 class="flex items-baseline space-x-3">
		<TagIcon />
		<span>
			{data.tag}
		</span>
	</H1>

	<EntryList entries={data.entries} />
</div>
