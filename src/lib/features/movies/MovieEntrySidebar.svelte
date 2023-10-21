<script lang="ts">
	import { page } from "$app/stores";
	import Muted from "$lib/components/atoms/Muted.svelte";

	import { createQuery } from "@tanstack/svelte-query";
	import { makeLogo } from "./tmdb";

	export let tmdbId: number;
	$: query = createQuery({
		queryKey: ["movies", "details", tmdbId],
		queryFn: async () => trpc($page).movies.public.byId.query(tmdbId),
		staleTime: 1000 * 60 * 60 * 24,
	});
	const watchSections = [
		["flatrate", "Stream"],
		// ["rent", "Rent"],
		// ["buy", "Buy"],
	] as const;
</script>

{#if $query.isLoading}
	loading...
{:else if $query.isError}
	Error
{:else if $query.isSuccess}
	{@const { movie } = $query.data}
	{@const { results } = movie["watch/providers"]}
	{@const locale = "US"}
	{@const watchProviders = results[locale]}
	{#if watchProviders}
		<div>
			<!-- TODO: localization -->
			<div class="grid auto-rows-fr grid-cols-[minmax(90px,_auto)_1fr] items-center gap-1 text-sm">
				{#if watchProviders["flatrate"]?.length}
					<div class="flex flex-col">
						<Muted>Streaming</Muted>
						<Muted class="text-xs">via justwatch</Muted>
					</div>
					<a
						target="_blank"
						rel="noreferrer"
						href={watchProviders.link}
						class="flex items-center gap-1 overflow-x-auto "
					>
						{#each watchProviders["flatrate"] || [] as service}
							<!-- content here -->
							<img class="h-8 w-8 rounded-xl" src={makeLogo(service.logo_path, "w92")} alt="" />
							<!-- {service.provider_name} -->
						{/each}
					</a>
				{/if}
			</div>
			<div class="flex flex-col">
				<!-- content here -->
			</div>
		</div>
	{/if}
{/if}
