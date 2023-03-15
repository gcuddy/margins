<script lang="ts">
	import { page } from "$app/stores";
	import GenericInput from "$lib/components/GenericInput.svelte";
	import ImageLoader from "$lib/components/ui/images/ImageLoader.svelte";
	import EntryListItem from "$lib/features/entries/EntryListItem.svelte";
	import { trpcWithQuery } from "$lib/trpc/client";
	import dayjs from "$lib/dayjs";
	import debounce from "lodash/debounce";

	let value = "";

	const client = trpcWithQuery($page);

	$: query = client.public.games.createQuery(
		{
			search: value,
		},
		{
			enabled: value.length > 2,
		}
	);

	const handleInput = debounce((e) => {
		value = e.target.value;
	}, 300);
</script>
<div class="flex flex-col">

    <div>
        <GenericInput on:input={handleInput} />
    </div>
    <div class="container mx-auto">
        {#if $query.isInitialLoading}
            loading
        {:else if $query.isError}
            error
        {:else if $query.isSuccess}
        <ul class="px-4 flex flex-col space-y-4">
            {#each $query.data || [] as game}
            {@const image = game.cover?.url?.replace("t_thumb", "t_cover_big")}
               <li>
                   <a href="/games/{game.id}" class="flex gap-4 items-center">
                    <ImageLoader src={image} class="h-12 w-10 sm:h-16 sm:w-14 rounded shadow-lg" alt="" />
                    <div class="flex flex-col gap-1">
                    <span class="font-medium text-lg">{game.name}</span>
                    <span class="text-muted">{dayjs.unix(game.first_release_date).year()}</span>
                               </div>
                   </a>
               </li>
            {/each}</ul>
        {/if}
    </div>
</div>
