<script lang="ts">
	import { ExternalLinkIcon } from 'lucide-svelte';

	import smoothload from '$lib/actions/smoothload';
	import { H1, Lead, Muted } from '$lib/components/ui/typography';
	import { formatDuration } from '$lib/utils/dates';

	import type { PageData } from './$types';
	import BookmarkForm from './BookmarkForm.svelte';
	import EntryOperations from './EntryOperations.svelte';

	type Album = PageData['album'];
	export let data: PageData & {
		album: NonNullable<Album>;
	};

	$: ({ album } = data);
</script>

<div class="flex select-text flex-col gap-4">
	<div class="flex gap-6 max-sm:flex-col sm:items-center">
		<img
			src={album.images[0].url}
			alt=""
			class="aspect-auto rounded-md shadow-lg sm:w-[150px] md:w-[200px]"
			use:smoothload
		/>
		<div class="flex flex-col gap-2">
			<Muted>Album</Muted>
			<H1>{album.name}</H1>
			<Lead>
				{#if album.artists.length}
					<span class="space-x-1">
						{#each album.artists as artist, i}
							{#if i !== 0}<span class="text-muted-foreground"> • </span>{/if}
							<a href={artist.uri}> {artist.name}</a>
						{/each}
					</span>
				{/if} — {new Date(album.release_date).getFullYear()}
			</Lead>
			<Muted>
				<a target="_blank" href={album.external_urls.spotify}
					>Spotify
					<ExternalLinkIcon class="ml-1 inline-block h-4 w-4" />
				</a>
			</Muted>
			<div class="flex items-center gap-2">
				<BookmarkForm data={data.bookmarkForm} />
				{#if data.entry}
					<EntryOperations data={data.annotationForm} entry={data.entry} />
				{/if}
			</div>
		</div>
	</div>

	<dl class="grid grid-cols-[1fr,1fr,1fr] gap-3 pt-2 text-sm">
		<div class="flex flex-col">
			<dt class="text-xs uppercase"><Muted>Tracks</Muted></dt>
			<dd>
				<Muted>
					{album.total_tracks}
				</Muted>
			</dd>
		</div>
		<div class="flex flex-col">
			<dt class="text-xs uppercase"><Muted>Duration</Muted></dt>
			<dd>
				<Muted>
					{@const duration = album.tracks.items.reduce((acc, cur) => acc + cur.duration_ms, 0)}
					{formatDuration(duration, 'ms')}
				</Muted>
			</dd>
		</div>
		<div class="flex flex-col">
			<dt class="text-xs uppercase"><Muted>Release Date</Muted></dt>
			<dd>
				<Muted>
					{album.release_date}
				</Muted>
			</dd>
		</div>
		<div class="flex flex-col">
			<dt class="text-xs uppercase"><Muted>Label</Muted></dt>
			<dd>
				<Muted>
					{album.label}
				</Muted>
			</dd>
		</div>
	</dl>

	<div class="prose prose-stone space-y-4 dark:prose-invert">
		<div>
			{album.total_tracks}
		</div>
	</div>
</div>
