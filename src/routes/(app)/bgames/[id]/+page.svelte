<script lang="ts">
	import { page } from "$app/stores";
	import Muted from "$lib/components/atoms/Muted.svelte";
	import Button from "$lib/components/Button.svelte";
	import MediaEntry from "$lib/components/layout/MediaEntry.svelte";
	import dayjs from "$lib/dayjs";
	import { trpcWithQuery } from "$lib/trpc/client";
	export let data;
	$: ({ id, initialData } = data);
	const client = trpcWithQuery($page);
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
	<div class="container mx-auto flex flex-col items-center justify-center p-4 select-text">
		<MediaEntry image_dimensions="w-60" {title} {image} author={$query.data.primary_designer?.name || ''}>
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
                <Button>Save to inbox</Button>
           </div>
            <div class="prose">
                {@html $query.data.description}
            </div>
        </MediaEntry>
	</div>
{/if}
