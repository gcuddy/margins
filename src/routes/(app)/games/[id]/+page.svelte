<script lang="ts">
	import Muted from "$lib/components/atoms/Muted.svelte";
	import Button from "$lib/components/Button.svelte";
	import MediaEntryHeader from "$lib/components/layout/MediaEntry.svelte";
	import dayjs from "$lib/dayjs";

	export let data;
	$: query = data.query();
	$: console.log({ $query });
</script>

<div class="container mx-auto flex flex-col items-center justify-center p-4">
	{#if $query.isLoading}
		Loading...
	{:else if $query.isError}
		Error
	{:else if $query.isSuccess}
		{@const game = $query.data}
		{@const image = game.cover?.url?.replace("t_thumb", "t_cover_big") || ""}
		{@const year = dayjs.unix(game.first_release_date).year()}
		<MediaEntryHeader image_dimensions="h-auto w-44" title={game.name} {year} {image}>
            <div slot="description">
                <dl class="grid">
					<div class="flex flex-col">
						<dt class="text-xs uppercase"><Muted>Platforms</Muted></dt>
						<dd>
							<Muted>
								{game.platforms.map((platform) => platform.name).join(", ")}
							</Muted>
						</dd>
					</div>
				</dl>
                <!-- todo: websites -->
                {game.websites}
            </div>
			<div slot="actions">

				<div class="mt-auto">
					<Button>Save to inbox</Button>
				</div>
			</div>
			<div class="prose mx-auto">
				{@html game.summary}
			</div>
		</MediaEntryHeader>
	{/if}
</div>
