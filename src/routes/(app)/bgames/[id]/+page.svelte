<script lang="ts">
	import { page } from "$app/stores";
	import Muted from "$lib/components/atoms/Muted.svelte";
	import Button from "$lib/components/Button.svelte";
	import Cluster from "$lib/components/helpers/Cluster.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import MediaEntry from "$lib/components/layout/MediaEntry.svelte";
	import dayjs from "$lib/dayjs";
	import { categories } from "$lib/features/entries/boardgame";
	import { trpcWithQuery } from "$lib/trpc/client";
	export let data;
	$: ({ id, initialData } = data);
	const client = trpcWithQuery($page);
	const mutation = client.bookmarks.save.createMutation();
	$: query = client.public.boardGameById.createQuery(
		{
			id,
		},
		{
			initialData,
		}
	);
</script>

{#if $query.isInitialLoading}
	loading
{:else if $query.isError}
	error
{:else if $query.isSuccess}
	{@const { name: title, image_url: image } = $query.data}
	{@const author = $query.data.primary_designer?.name || ""}
	<div class="container mx-auto flex select-text flex-col items-center justify-center p-4">
		<MediaEntry
			image_dimensions="w-60"
			{title}
			{image}
			publisher={$query.data.primary_publisher?.name}
			author={$query.data.primary_designer?.name || ""}
		>
        <svelte:fragment slot="top">
            {#if $query.data.official_url}
                <a href="{$query.data.official_url}" target="_blank" rel="noopener noreferrer" class="text-xs flex items-center space-x-0.5 mt-1">
                    <Muted>Website</Muted>
                    <Icon name="arrowTopRightOnSquareMini" className="w-3 h-3 fill-muted" />
                </a>
            {/if}
        </svelte:fragment>
        <div slot="description">
				<dl class="grid grid-cols-[1fr,1fr] gap-x-2 gap-y-4 pt-2">
					<div class="flex flex-col">
						<dt class="text-xs uppercase"><Muted>Year Published</Muted></dt>
						<dd><Muted>{$query.data.year_published}</Muted></dd>
					</div>
					<div class="flex flex-col">
						<dt class="text-xs uppercase"><Muted>Players</Muted></dt>
						<dd><Muted>{$query.data.min_players} – {$query.data.max_players}</Muted></dd>
					</div>
					<div class="flex flex-col">
						<dt class="text-xs uppercase"><Muted>Playtime</Muted></dt>
						<dd><Muted>{$query.data.min_playtime} – {$query.data.max_playtime} mins</Muted></dd>
					</div>
					<div class="flex flex-col">
						<dt class="text-xs uppercase"><Muted>Ages</Muted></dt>
						<dd><Muted>{$query.data.min_age}+</Muted></dd>
					</div>
				</dl>
			</div>
			<div slot="actions">
				<Button
					on:click={() => {
						if (!$query.data) return;
						// TODO: extended data for playtime, players, and ages
						$mutation.mutate({
							entry: {
								title,
								image,
								author: $query.data?.primary_designer?.name,
								published: dayjs().year($query.data.year_published).toDate(),
								publisher: $query.data?.primary_publisher?.name,
								uri: "bgame:" + $query.data.id,
								html: $query.data.description,
								type: "board_game",
								extended: {
									boardGame: {
										min_players: $query.data.min_players,
										max_players: $query.data.max_players,
										min_playtime: $query.data.min_playtime,
										max_playtime: $query.data.max_playtime,
										min_age: $query.data.min_age,
									},
								},
							},
						});
					}}>Save to inbox</Button
				>
			</div>
			<div class="prose">
				{@html $query.data.description}
			</div>
		</MediaEntry>
	</div>
{/if}
