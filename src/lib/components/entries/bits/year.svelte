<script lang="ts">
	import { filterLibrary } from "$lib/schemas/library";
	import { defaultStringifySearch } from "$lib/utils/search-params";

	export let date: string | Date;

    $: _date = date instanceof Date ? date : new Date(date)
</script>

<a
	href="/library/all{defaultStringifySearch(
		filterLibrary({
			published: {
				// get first day of year
				gte: new Date(_date.getFullYear(), 0, 1),
				// get last day of year
				lte: new Date(_date.getFullYear(), 11, 31),
			},
		}),
	)}"
	class="text-muted-foreground underline underline-offset-2 decoration-border hover:text-primary"
>
	{_date.getFullYear()}
</a>
