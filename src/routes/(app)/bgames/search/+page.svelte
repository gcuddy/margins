<script lang="ts">
	import { page } from "$app/stores";
	import GenericInput from "$lib/components/GenericInput.svelte";
	import ImageLoader from "$lib/components/ui/images/ImageLoader.svelte";
	import { trpc } from "$lib/trpc/client";
	import debounce from "lodash/debounce";
	let form: HTMLFormElement;

	const client = trpc($page);

	let value = "";
	$: query = client.public.boardgames.createQuery(
		{
			search: value,
		},
		{
			enabled: value.length > 2,
		}
	);

	const handleInput = debounce((e) => {
        value = e.target.value;
	}, 300, {
        leading: true
    });

</script>

<svelte:head>
    <title>Margins - Board Game Search</title>
</svelte:head>
<div class="flex flex-col">
	<form data-sveltekit-keepfocus bind:this={form}>
		<!-- <label for="q">Query</label> -->
		<GenericInput id="q" type="text" name="q" on:input={handleInput} />
	</form>
	<div class="container mx-auto">
		{#if $query.isInitialLoading}
			loading
		{:else if $query.isError}
			error
		{:else if $query.isSuccess}
			<ul class="flex flex-col space-y-4 px-4">
				{#each $query.data || [] as game}
					<li>
                        <a href="/bgames/{game.id}" class="flex gap-4 items-center">
                            <ImageLoader src={game.image_url} class="h-12 w-10 sm:h-16 sm:w-14 rounded shadow-lg" alt="" />
                            <div>
                                <span>{game.name}</span>
                                <span>{game.year_published}</span>
                            </div>
                        </a>
                    </li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
