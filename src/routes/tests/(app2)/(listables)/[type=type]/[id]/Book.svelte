<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import {
		Dialog,
		DialogTrigger,
		DialogTitle,
		DialogContent,
		DialogHeader
	} from '$lib/components/ui/dialog';
	import { Tabs, TabsList, TabsContent, TabsTrigger } from '$lib/components/ui/tabs';
	import { tabContent } from '$lib/components/ui/tabs/TabsContent.svelte';
	import { tabList } from '$lib/components/ui/tabs/TabsList.svelte';
	import { tabTrigger } from '$lib/components/ui/tabs/TabsTrigger.svelte';
	import { H1, Lead, Muted } from '$lib/components/ui/typography';
	import { cn } from '$lib/utils/tailwind';
	import { ExternalLink, PlusCircle } from 'lucide-svelte';
	import type { PageData } from './$types';
	import Annotation from './Annotation.svelte';
	import BookmarkForm from './BookmarkForm.svelte';
	import EntryOperations from './EntryOperations.svelte';
	import Interaction from './Interaction.svelte';
	import InteractionForm from './InteractionForm.svelte';

	type Book = PageData['book'];
	export let data: PageData & {
		book: NonNullable<Book>;
	};
	$: ({ book } = data);

	const strip_gbook_curl = (url: string) => {};

	$: isbn = book.volumeInfo?.industryIdentifiers?.find((i) => i.type === 'ISBN_13')?.identifier;

	$: author = book.volumeInfo?.authors?.join(', ');

	$: year = book.volumeInfo?.publishedDate?.split('-')[0];

	function handleImgError(e: Event) {
		console.log(e, 'erro');
		const img = e.target as HTMLImageElement;
		img.src = data.book.volumeInfo?.imageLinks?.extraLarge ?? '';
	}

	function getGbookImage(book: NonNullable<Book>) {
		const { volumeInfo } = book;
		if (!volumeInfo) return '';
		const { imageLinks } = volumeInfo;
		if (!imageLinks) return;
		const { extraLarge, large, medium, small, thumbnail } = imageLinks;
		// try thumbnail first, setting zoom to 0 and removing curl
		// if that fails, try small, medium, large, extraLarge
		if (thumbnail) {
			console.log('thumbnail', thumbnail);
			const url = new URL(thumbnail);
			// url.searchParams.set("zoom", "0");
			url.searchParams.delete('edge');
			return url.href;
		}

		return extraLarge ?? large ?? medium ?? small ?? thumbnail;
	}

	const tabs = ['Summary', 'Interactions', 'Notes'];

	$: tab_param = $page.url.searchParams.get('tab') ?? tabs[0].toLowerCase();
</script>

<div class="flex select-text flex-col gap-4">
	<div class="flex items-center gap-6">
		<!-- src="https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg?default=false" -->
		<img
			class="aspect-auto max-w-[200px] rounded-md shadow-lg"
			on:error={(e) => console.log(e)}
			src={getGbookImage(book)}
			alt=""
		/>
		<div class="flex flex-col gap-2">
			<Muted>Book</Muted>
			<H1>{book.volumeInfo?.title}</H1>
			<Lead>
				{author} — {year}
			</Lead>
			<Lead class="text-base">
				isbn: {isbn}
			</Lead>
			<div class="flex items-center gap-x-4">
				<Muted>
					publisher: {book.volumeInfo?.publisher}
				</Muted>
				<Muted>
					<a href={book.volumeInfo.previewLink} target="_blank"
						>google
						<ExternalLink class="inline-block h-4 w-4" />
					</a>
				</Muted>
				{#if isbn}
					<Muted>
						<a href="https://bookshop.org/book/{isbn}" target="_blank"
							>bookshop
							<ExternalLink class="inline-block h-4 w-4" />
						</a>
					</Muted>
				{/if}
			</div>
			<div class="flex items-center gap-2">
				<BookmarkForm data={data.bookmarkForm} />
				{#if data.entry}
					<EntryOperations data={data.annotationForm} entry={data.entry} />
				{/if}
			</div>
		</div>
	</div>

	<div class="prose prose-slate mt-6 dark:prose-invert">
		<!-- this is the js-free version, but how's the a11y? -->
		<div class={cn(tabList, 'not-prose')} data-sveltekit-keepfocus>
			{#each tabs as tab}
				{@const selected = tab_param === tab.toLowerCase()}
				<a
					data-sveltekit-replacestate
					class={tabTrigger({ selected })}
					href="?tab={tab.toLowerCase()}"
				>
					{#if tab === 'Notes'}
						{tab} {data.entry?.annotations?.length ?? 0}
					{:else}
						{tab}
					{/if}
				</a>
			{/each}
		</div>
		<div class={tabContent}>
			{#if tab_param === 'summary'}
				{@html book.volumeInfo?.description}
			{/if}
			{#if tab_param === 'interactions'}
				{#if data.entry?.interaction}
					<Interaction
						data={data.interactionForm}
						interaction={data.entry.interaction}
						total_pages={book.volumeInfo?.pageCount}
					/>
				{/if}
				{#if !!data.entry && !data.entry?.interaction}
					<Dialog>
						<svelte:fragment slot="trigger">
							<Button>New Interaction</Button>
						</svelte:fragment>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>New Interaction</DialogTitle>
							</DialogHeader>
							<InteractionForm data={data.interactionForm} entry={data.entry} />
						</DialogContent>
					</Dialog>
				{/if}
			{/if}
			{#if tab_param === 'notes'}
				<Button>
					<PlusCircle class="mr-2 h-4 w-4" />
					New note</Button
				>
				{#each data.entry?.annotations ?? [] as annotation}
					<Annotation
						data={data.annotationForm}
						entry={{
							id: data.entry?.id ?? 0
						}}
						{annotation}
					/>
				{/each}
			{/if}
		</div>
		<!-- <Tabs defaultIndex={1}>
			<TabsList>
				<TabsTrigger>Summary</TabsTrigger>
				<TabsTrigger>Interactions</TabsTrigger>
				<TabsTrigger>Notes</TabsTrigger>
			</TabsList>
			<TabsContent>
				{@html book.volumeInfo?.description}
			</TabsContent>
			<TabsContent>Interactions</TabsContent>
		</Tabs> -->
	</div>
</div>
