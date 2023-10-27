<script lang="ts">
	import {
		CheckIcon,
		Disc3Icon,
		DiscIcon,
		ExternalLinkIcon,
		PlusCircle,
		PlusIcon,
		XIcon,
	} from 'lucide-svelte';

	import smoothload from '$lib/actions/smoothload';
	import { H1, Lead, Muted } from '$lib/components/ui/typography';
	import { formatDate, formatDuration } from '$lib/utils/date';

	import type { PageData } from './$types';
	import * as Tabs from '$components/ui/tabs';
	import BookmarkForm from './BookmarkForm.svelte';
	import EntryOperations from './EntryOperations.svelte';
	import * as Table from '$components/ui/table';
	import StarRating from '$components/ui/star-rating/star-rating.svelte';
	import { enhance } from '$app/forms';
	import { findClosestImage } from '$lib/utils';
	import StarRatingForm from '$components/ui/star-rating/star-rating-form.svelte';
	import LogInteractionForm from '$components/entries/interaction-form/log-interaction-form.svelte';
	type Album = PageData['album'];

	import * as Dialog from '$components/ui/dialog';
	import { Button } from '$components/ui/button';
	import LogInteractionDialog from '$components/entries/interaction-form/log-interaction-dialog.svelte';
	import InteractionsTable from '$components/entries/interactions/interactions-table.svelte';
	import SaveToLibraryButton from '$components/entries/save-to-library-button.svelte';
	import { page } from '$app/stores';
	import { EntryMediaHeader } from '$components/entries';
	import LibraryForm from '$components/ui/library/library-form.svelte';
	export let data: PageData & {
		album: NonNullable<Album>;
	};

	$: tab = $page.url.searchParams.get('tab') ?? 'info';

	$: console.log({ data });

	$: ({ album } = data);

	$: img = findClosestImage(album.images, 600);
</script>

<div class="flex select-text flex-col gap-4">
	<EntryMediaHeader title={album.name} type="album">
		<svelte:fragment slot="artwork">
			<div
				class="aspect-auto rounded-md shadow-lg w-44 @lg:self-start supports-ncq:md:self-start"
			>
				{#if img}
					<img
						style="view-transition-name:album-artwork-{album.id}"
						src={img.url}
						alt=""
						class="w-full h-full"
						use:smoothload
					/>
				{/if}
			</div>
		</svelte:fragment>
		<Lead slot="meta">
			{#if album.artists.length}
				<span class="space-x-1">
					{#each album.artists as artist, i}
						{#if i !== 0}<span class="text-muted-foreground"> • </span>{/if}
						<a href={artist.uri}> {artist.name}</a>
					{/each}
				</span>
			{/if} · {new Date(album.release_date).getFullYear()}
		</Lead>
		<svelte:fragment slot="actions">
			<div class="basis-full">
				<StarRatingForm
					rating={data.entry?.bookmark?.rating ?? 0}
					entryId={data.entry?.id}
				/>
			</div>
			<LibraryForm
					bodyPortal
					unsavedStyle="arrow"
					status={data.entry?.bookmark?.status ?? undefined}
					variant="secondary"
					type="album"
					entryId={data.entry?.id}
					spotifyId={album.id ?? undefined}
				/>


				{#if $page.data.logInteractionForm}
					<LogInteractionDialog
						entry={{
							title: album.name,
							type: 'album',
							published: new Date(album.release_date),
							image: img?.url,
							spotifyId: album.id,
						}}
						entryId={data.entry?.id}
						form={$page.data.logInteractionForm}
					></LogInteractionDialog>
				{/if}

		</svelte:fragment>
	</EntryMediaHeader>

	<Tabs.Root value={tab} class="mt-8">
		<Tabs.List>
			<Tabs.Trigger value="info">Info</Tabs.Trigger>
			<Tabs.Trigger disabled={!data.entry?.interactions} value="activity"
				>Activity</Tabs.Trigger
			>
		</Tabs.List>
		<Tabs.Content value="info">
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
							{@const duration = album.tracks.items.reduce(
								(acc, cur) => acc + cur.duration_ms,
								0,
							)}
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

			<div>
				<Table.Root>
					<Table.Caption>Tracklist for {album.name}</Table.Caption>
					<Table.Header>
						<Table.Row>
							<Table.Head>#</Table.Head>
							<Table.Head>Name</Table.Head>
							<Table.Head>Artist</Table.Head>
							<Table.Head>Duration</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each album.tracks.items as track, i}
							<Table.Row>
								<Table.Cell>{track.track_number}</Table.Cell>
								<Table.Cell>
									<a
										target="_blank"
										rel="noreferrer"
										href={track.external_urls?.spotify}>{track.name}</a
									>
								</Table.Cell>
								<Table.Cell>
									{#each track.artists as artist, i}
										<a
											target="_blank"
											rel="noreferrer"
											class="text-muted-foreground hover:underline"
											href={artist.external_urls.spotify}>{artist.name}</a
										>{#if i !== track.artists.length - 1}{', '}{/if}
									{/each}
								</Table.Cell>
								<Table.Cell
									>{formatDuration(
										track.duration_ms,
										'ms',
										true,
										':',
									)}</Table.Cell
								>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>

			<div class="prose prose-stone space-y-4 dark:prose-invert">
				<div>
					<!-- <pre>
                {JSON.stringify(album, null, 2)}
            </pre> -->
				</div>
			</div>

			<!-- METADATA / COPYRIGHT -->
			<footer class="text-xs text-muted-foreground flex flex-col gap-1">
				<time datetime={album.release_date}
					>{formatDate(album.release_date, {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					})}</time
				>
				{#each album.copyrights as { text, type }}
					<!-- {type} -->
					<span>{type === 'P' ? '℗' : '©'} {text.replace(/(℗|©)/g, '')}</span>
				{/each}
				<span class="mt-3">Data provided by Spotify.</span>
			</footer>
		</Tabs.Content>
		{#if data.entry?.interactions}
			<Tabs.Content value="activity">
				<InteractionsTable
					interactions={data.entry?.interactions}
					entry={data.entry}
				/>
			</Tabs.Content>
		{/if}
	</Tabs.Root>
</div>
<!-- {#if data.entry}
	<Dialog.Root bind:open={isLogInteractionDialogOpen}>
		<Dialog.Content>
			<LogInteractionForm entry={data.entry} form={data.logInteractionForm} />
		</Dialog.Content>
	</Dialog.Root>
{/if} -->
