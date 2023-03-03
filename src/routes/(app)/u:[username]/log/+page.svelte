<script lang="ts">
	import { page } from "$app/stores";
	import EntryList from "$lib/components/EntryList.svelte";
	import { createQuery } from "@tanstack/svelte-query";
	import dayjs from "$lib/dayjs";
    import groupby from "lodash.groupby";
	import type { PageData } from "./$types";
	import { logQuery } from "./query";
	// fix bigint issue
	//@ts-expect-error
	BigInt.prototype.toJSON = function () {
		return this.toString();
	};
	// export let data: PageData;

	const q = createQuery({
		...logQuery($page),
		select: (data) => groupby(data, (item) => dayjs(item.date).format("MMMM YYYY")),
	});
</script>

{#if $q.isLoading}
	loading...
{:else if $q.isError}
	error
{:else if $q.isSuccess}
	<!-- {$q.data.} -->
	<!-- group by date -->
	<div class="flex flex-col">
		{#each Object.entries($q.data) as [date, values]}
			{@const items = values.map((item) => item.entry)}
			<div class="bg-border/50 p-4">
				<div class="px-2">
					<h2 class="text-lg text-content/90 font-medium">{date}</h2>
				</div>
			</div>
			<EntryList {items} />
		{/each}
	</div>
{/if}
