<script lang="ts">
	import { enhance } from "$app/forms";
	import { page } from "$app/stores";
	import Annotation from "$lib/components/Annotation.svelte";
	import AnnotationInput from "$lib/components/annotations/AnnotationInput.svelte";
	import RichAnnotationInput from "$lib/components/annotations/RichAnnotationInput.svelte";
	import Muted from "$lib/components/atoms/Muted.svelte";
	import Button from "$lib/components/Button.svelte";
	import dayjs from "$lib/dayjs";
	import { configuration } from "$lib/features/movies/tmdb";
	import { trpc } from "$lib/trpc/client";
	import type { RouterOutputs } from "$lib/trpc/router";
	import type { Prisma } from "@prisma/client";
	import { createQuery } from "@tanstack/svelte-query";

	export let id: number;
	export let entryId: number | undefined = undefined;
	export let item: RouterOutputs["movies"]["public"]["byId"] | undefined = undefined;

	$: bookmarked = $page.data.user?.bookmarks.some((b) => b.entry?.tmdbId === id) || false;

	$: query = createQuery({
		queryKey: ["movies", "details", id],
		queryFn: async () => trpc($page).movies.public.byId.query(id),
		staleTime: 5 * 1000 * 60,
		// refetchOnWindowFocus: false,
		onSettled: (data) => console.log(data),
		initialData: item,
		onSuccess: (data) => {
			//REVIEW: update entry.original or entry.tmdbData
			if (entryId && data) {
				// trpc($page).entries.update.mutate({
				// 	id: entryId,
				// 	data: {
				// 		tmdbData: data as any,
				// 	},
				// });
			}
		},
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
	{@const movie = $query.data?.movie}
	{#if movie}
		{@const logo = movie.images?.logos?.[0]}
		<!-- TODO: srcset -->
		<div
			style:--backgroundImage={`url(https://image.tmdb.org/t/p/w1280/${
				movie?.images?.backdrops?.[0].file_path ?? movie.backdrop_path
			})`}
			class="hero-container container relative mx-auto flex h-full max-h-[40vh] flex-col justify-end before:absolute before:inset-0  before:bg-cover before:bg-center before:bg-no-repeat "
		>
			<div class="poster-gradient-r absolute inset-0" />
			<div class="poster-gradient-l absolute inset-0" />
		</div>

		<div class="meta container relative mx-auto -mt-16 grow">
			<div class="z-10 flex justify-between p-4">
				<div class="flex flex-col gap-2">
					<div class="flex gap-4">
						<div>
							<img
								class=" max-w-[230px] self-start rounded-lg border border-border shadow ring-1 ring-border/50 "
								src="https://image.tmdb.org/t/p/w500/{movie.poster_path}"
								alt="Poster for {movie.title}"
							/>
						</div>
						<div class="flex flex-col gap-2">
							<h1 class=" font-serif text-5xl font-bold dark:drop-shadow-lg">{movie.title}</h1>
							{#if !bookmarked}
								<form class="flex flex-col" action="?/save" use:enhance method="post">
									<input type="hidden" name="title" value={movie.title} />
									<input
										type="hidden"
										name="author"
										value={movie?.credits?.crew
											.filter((c) => c.job === "Director")
											.map((c) => c.name)
											.join(", ")}
									/>
									<input type="hidden" name="imdbId" value={movie.external_ids.imdb_id} />
									<input type="hidden" name="summary" value={movie.overview} />
									<input type="hidden" name="release" value={movie.release_date} />
									<input type="hidden" name="duration" value={movie.runtime * 60} />
									<input
										type="hidden"
										name="image"
										value="https://image.tmdb.org/t/p/original/{movie.poster_path}"
									/>

									<Button type="submit" size="lg">Save</Button>
								</form>
							{/if}
							<div class="flex gap-2">
								<Muted>
									{dayjs(movie.release_date).year()}
								</Muted>
								<Muted>
									Directed by {movie.credits.crew.find((c) => c.job === "Director")?.name}
								</Muted>
							</div>
							<div class="prose max-w-prose">
								<!-- <p>{movie.tagline}</p> -->
								<p>{@html movie.overview}</p>
							</div>
							{#if movie.credits.cast?.length}
								<div>
									<Muted>Starring</Muted>
									{movie.credits.cast
										?.slice(0, 3)
										.map((c) => c.name)
										.join(", ")}
								</div>
							{/if}
							<div>
								<Muted>Genres</Muted>
								{movie.genres
									?.slice(0, 3)
									.map((c) => c.name)
									.join(", ")}
							</div>
						</div>
					</div>
					<!-- {#if movie["watch/providers"]?.results}
						{@const { results } = movie["watch/providers"]}
						{@const locale = "US"}
						{@const watchProviders = results[locale]}
						{#if watchProviders}
							<div>
								<a target="_blank" href={watchProviders.link}>Watch providers provided by JustWatch</a>
								<div class="flex flex-col">
									{#each watchSections as [key, Display]}
										{#if watchProviders?.[key]}
											<h3>{Display}</h3>
											<div class="flex items-center gap-1 overflow-x-auto ">
												{#each watchProviders[key] as service}
													<img class="h-10 w-10 rounded-xl" src={makeLogo(service.logo_path, "w92")} alt="" />
												{/each}
											</div>
										{/if}
									{/each}
								</div>
							</div>
						{/if}
					{/if} -->
				</div>
			</div>
		</div>
		<div class="flex flex-col justify-center mx-auto">
			<RichAnnotationInput placeholder="Write note…" />
		</div>
	{/if}
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

	.poster-gradient-l {
		background-image: linear-gradient(90deg, hsl(var(--color-base) / 1) 0%, transparent 10%);
	}
	.poster-gradient-r {
		background-image: linear-gradient(270deg, hsl(var(--color-base) / 1) 0%, transparent 10%);
	}
</style>
