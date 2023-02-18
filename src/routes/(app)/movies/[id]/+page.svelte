<script lang="ts">
	import { enhance } from "$app/forms";
	import { page } from "$app/stores";
	import Muted from "$lib/components/atoms/Muted.svelte";
	import Button from "$lib/components/Button.svelte";
	import ContextMenu from "$lib/components/ContextMenu.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import dayjs from "$lib/dayjs";
	import { addEntriesToCollection } from "$lib/features/collections/stores";
	import { configuration } from "$lib/features/movies/tmdb";
	import { trpc } from "$lib/trpc/client";
	import { createQuery } from "@tanstack/svelte-query";
	import type { PageData } from "./$types";

	export let data: PageData;

	$: query = createQuery({
		queryKey: ["movies", "details", data.id],
		queryFn: async () => trpc($page).movies.public.byId.query(data.id),
		staleTime: 5 * 1000 * 60,
		// refetchOnWindowFocus: false,
		onSettled: (data) => console.log(data),
	});

	const makeLogo = (path: string, size: (typeof configuration.images.logo_sizes)[number] = "w500") =>
		configuration.images.secure_base_url + size + path;

	const watchSections = [
		["flatrate", "Stream"],
		["rent", "Rent"],
		// ["buy", "Buy"],
	] as const;
</script>

<!-- TODO: setting to enable "normal" movie page vs very fancy one -->

{#if $query.isLoading}
	<p>Loading...</p>
{:else if $query.isSuccess}
	{@const movie = $query.data.movie}
	{@const logo = movie.images?.logos?.[0]}
	<!-- TODO: srcset -->
	<div
		style:--backgroundImage={`url(https://image.tmdb.org/t/p/w1280/${movie.backdrop_path})`}
		class="hero-container relative flex h-full max-h-[60vh] flex-col justify-end before:absolute before:inset-0 before:bg-cover before:bg-local before:bg-[50%_33%] before:bg-no-repeat "
	>
		<div class=" z-10 flex flex-col">
			<div class="p-4">
				{#if logo}
					<img
						draggable="false"
						class="z-10 max-h-[50vh] max-w-[min(33vw,500px)]"
						src="https://image.tmdb.org/t/p/original/{logo.file_path}"
						alt=""
					/>
				{:else}
					<h1 class="font-serif text-5xl font-bold drop-shadow-lg">{movie.title}</h1>
				{/if}
			</div>
		</div>
	</div>
	<div class="meta relative">
		<div class="z-10 flex justify-between p-4">
			<div class="flex flex-col gap-2">
				<div class="flex gap-4">
					<form class="flex flex-col" action="?/save" use:enhance method="post">
						<input type="hidden" name="title" value={movie.title} />
						<input
							type="hidden"
							name="author"
							value={movie.credits.crew
								.filter((c) => c.job === "Director")
								.map((c) => c.name)
								.join(", ")}
						/>
						<input type="hidden" name="imdbId" value={movie.external_ids.imdb_id} />
						<input type="hidden" name="summary" value={movie.overview} />
						<input type="hidden" name="release" value={dayjs(movie.release_date).toISOString()} />
						<input
							type="hidden"
							name="image"
							value="https://image.tmdb.org/t/p/original/{movie.poster_path}"
						/>

						<div class="flex">
							<Button type="submit" className="rounded-r-none">Save</Button>
							<ContextMenu
								class="h-full rounded-l-none bg-amber-400 text-black dark:hover:bg-amber-400 dark:hover:bg-opacity-90 "
								items={[
									[
										{
											label: "Add to collection",
											icon: "viewGridAddSolid",
											perform: async () => {
												let id = 0;
												if ($query.data?.entry?.id) {
													id = $query.data.entry.id;
												} else {
													const entry = await trpc().entries.create.mutate({
														data: {
															title: movie.title,
															author: movie.credits?.crew
																.filter((c) => c.job === "Director")
																.map((c) => c.name)
																.join(", "),
															uri: movie.external_ids.imdb_id,
															summary: movie.overview,
															image: `https://image.tmdb.org/t/p/original/${movie.poster_path}`,
															tmdbId: movie.id,
															// REVIEW: wtf
															// original: JSON.stringify(movie),
															duration: movie.runtime,
															published: dayjs(movie.release_date).toDate(),
														},
													});
													id = entry.id;
												}
												addEntriesToCollection(data.queryClient, [id]);
											},
										},
									],
								]}
								placement="bottom-start"
							>
								<Icon name="chevronDownMini" />
							</ContextMenu>
							<!-- <Button type="submit" size="lg" className="rounded-l-none !px-1" /> -->
						</div>
					</form>
					<div class="flex flex-col">
						<div class="flex gap-2">
							<Muted>
								{dayjs(movie.release_date).year()}
							</Muted>
							<Muted>
								Directed by {movie.credits.crew.find((c) => c.job === "Director")?.name}
							</Muted>
						</div>
						<div class="max-w-prose">
							<!-- <p>{movie.tagline}</p> -->
							<p>{movie.overview}</p>
						</div>
					</div>
				</div>
			</div>
			{#if movie["watch/providers"]?.results}
				{@const { results } = movie["watch/providers"]}
				{@const locale = "US"}
				{@const watchProviders = results[locale]}
				{#if watchProviders}
					<div>
						<!-- TODO: localization -->
						<a target="_blank" href={watchProviders.link}>Watch providers provided by JustWatch</a>
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

<style>
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
