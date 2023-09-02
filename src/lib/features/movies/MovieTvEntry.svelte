<script lang="ts">
	import { page } from "$app/stores";
	import Muted from "$lib/components/atoms/Muted.svelte";
	import Button from "$lib/components/Button.svelte";
	import dayjs from "$lib/dayjs";
	import { configuration } from "$lib/features/movies/tmdb";
	import { trpc } from "$lib/trpc/client";
	import type { RouterOutputs } from "$lib/trpc/router";
	import { createQuery } from "@tanstack/svelte-query";
	import { movieDetailQuery, tvDetailQuery } from "./queries";


	export let item: RouterOutputs["movies"]["public"]["byId"] | RouterOutputs["movies"]["public"]["tvById"];

	const makeLogo = (path: string, size: typeof configuration.images.logo_sizes[number] = "w500") =>
		configuration.images.secure_base_url + size + path;

	let type: "movie" | "tv";
	$: type = "name" in item ? "tv" : "movie";
	// $: query = createQuery(
	// 	type === "movie" ? { ...movieDetailQuery(item.id, $page) } : { ...tvDetailQuery(item.id, $page) }
	// );

    $: movie = createQuery({
        enabled: type === "movie",
        ...movieDetailQuery(item.id, $page)
    })

    $: tv = createQuery({
        enabled: type === "tv",
        ...tvDetailQuery(item.id, $page)
    })

	const watchSections = [
		["flatrate", "Stream"],
		// ["rent", "Rent"],
		// ["buy", "Buy"],
	] as const;
</script>

<!-- TODO: setting to enable "normal" movie page vs very fancy one -->

{#if $query.isLoading}
	<p>Loading...</p>
{:else if $query.isSuccess}
	{@const tv = $query.data}
	{@const logo = tv.images?.logos?.find((l) => !l.file_path?.endsWith("svg"))}
	<!-- TODO: srcset -->
	<div
		style:--backgroundImage={`url(https://image.tmdb.org/t/p/w1280/${tv.backdrop_path})`}
		class="hero-container container relative mx-auto flex h-full max-h-[60vh] flex-col justify-end before:absolute before:inset-0 before:bg-cover before:bg-local before:bg-[50%_33%] before:bg-no-repeat  "
	>
		<!-- <div class=" container z-10 mx-auto flex flex-col">
			<div class="p-4">
				{#if logo}
					<img
						draggable="false"
						class="z-10 max-h-[50vh] max-w-[min(33vw,500px)]"
						src="https://image.tmdb.org/t/p/original/{logo.file_path}"
						alt=""
					/>
				{:else}
					<h1 class="font-serif text-5xl font-bold drop-shadow-lg">{tv.name}</h1>
				{/if}
			</div>
		</div> -->
	</div>
	<div class="meta container relative mx-auto  -mt-10 ">
		<div class="z-10 flex justify-between p-4">
			<div class="flex flex-col gap-2">
				<div class="flex gap-4">
					<img
						class=" max-w-[230px] self-start rounded-lg shadow"
						src="https://image.tmdb.org/t/p/w500/{tv.poster_path}"
					/>
					<!-- <div class="flex flex-col">
						<Button size="lg">Save</Button>
					</div> -->
					<div class="flex flex-col gap-2">
						<h1 class=" font-serif text-5xl font-bold drop-shadow-lg">{tv.name}</h1>
						<Button className="self-start my-2" size="xl">Save</Button>

						<div class="flex gap-2">
							<Muted>
								{dayjs(tv.first_air_date).year()}
							</Muted>
							<Muted>
								Created by {tv.created_by.map((c) => c.name).join(", ")}
							</Muted>
						</div>
						<div class="max-w-prose">
							<!-- <p>{movie.tagline}</p> -->
							<p>{tv.overview}</p>
						</div>
						{#if tv.credits.cast?.length}
							<div>
								<Muted>Starring</Muted>
								{tv.credits.cast
									?.slice(0, 3)
									.map((c) => c.name)
									.join(", ")}
							</div>
						{/if}
						<dl class="grid grid-cols-[1fr,1fr,1fr] gap-3 pt-2">
							<div class="flex flex-col gap-0.5">
								<dt class="text-xs uppercase"><Muted>Seasons</Muted></dt>
								<dd class="flex grow items-center">{tv.number_of_seasons}</dd>
							</div>
							<div class="flex flex-col gap-0.5">
								<dt class="text-xs uppercase"><Muted>Status</Muted></dt>
								<dd class="flex grow items-center">{tv.status}</dd>
							</div>
							<div class="flex flex-col gap-0.5">
								<dt class="text-xs uppercase"><Muted>Network</Muted></dt>
								<dd class="flex grow items-center">
									{tv.networks.map((n) => n.name).join(", ")}
								</dd>
							</div>
							{#if tv["watch/providers"]?.results}
								{@const { results } = tv["watch/providers"]}
								{@const locale = "US"}
								{@const watchProviders = results[locale]}
								{#if watchProviders}
									<a
										target="_blank"
										rel="noreferrer"
										href={watchProviders.link}
										class="flex flex-col gap-0.5"
									>
										<dt class="text-xs uppercase"><Muted>Streaming (JustWatch)</Muted></dt>
										<!-- TODO: localization -->
										<!-- <a target="_blank" rel="noreferrer" href={watchProviders.link}
											>Watch providers provided by JustWatch</a
										> -->
										<div class="flex flex-col">
											{#each watchSections as [key, Display]}
												<!-- content here -->
												{#if watchProviders?.[key]}
													<!-- <h3>{Display}</h3> -->
													<div class="flex items-center gap-1 overflow-x-auto ">
														{#each watchProviders[key] as service}
															<!-- content here -->
															<img
																class="h-10 w-10 rounded-xl"
																src={makeLogo(service.logo_path, "w92")}
																alt=""
															/>
															<!-- {service.provider_name} -->
														{/each}
													</div>
													<!-- content here -->
												{/if}
											{/each}
										</div>
									</a>
								{/if}
							{/if}
						</dl>
					</div>
				</div>
			</div>
			{#if tv["watch/providers"]?.results}
				{@const { results } = tv["watch/providers"]}
				{@const locale = "US"}
				{@const watchProviders = results[locale]}
				{#if watchProviders && false}
					<div>
						<!-- TODO: localization -->
						<a target="_blank" rel="noreferrer" href={watchProviders.link}
							>Watch providers provided by JustWatch</a
						>
						<div class="flex flex-col">
							{#each watchSections as [key, Display]}
								<!-- content here -->
								{#if watchProviders?.[key]}
									<h3>{Display}</h3>
									<div class="flex items-center gap-1 overflow-x-auto ">
										{#each watchProviders[key] as service}
											<!-- content here -->
											<img class="h-10 w-10 rounded-xl" src={makeLogo(service.logo_path, "w92")} alt="" />
											<!-- {service.provider_name} -->
										{/each}
									</div>
									<!-- content here -->
								{/if}
							{/each}
						</div>
					</div>
				{/if}
			{/if}
		</div>
	</div>
{:else}
	<p>Error...</p>
{/if}

<style lang="postcss">
	/* .meta::before {
		content: "";
		position: absolute;
		top: -25px;
		left: 0;
		right: 0;
		bottom: 0;
		backdrop-filter: blur(40px);
		mask-image: linear-gradient(transparent, black 20%);
		z-index: -1;
	} */
	.hero-container::before {
		background-image: var(--backgroundImage);
		mask-image: linear-gradient(black, transparent);
	}
</style>
