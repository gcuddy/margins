<script lang="ts">
	import { createAvatar, melt } from '@melt-ui/svelte';
	import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
	import ISO6391 from 'iso-639-1';
	import {
		BookOpenCheckIcon,
		BookOpenIcon,
		BookPlusIcon,
		CheckIcon,
		ChevronDown,
		ExternalLink,
		PlusCircle,
		PlusIcon,
	} from 'lucide-svelte';
	import { derived, writable } from 'svelte/store';

	import { onNavigate } from '$app/navigation';
	import { navigating, page } from '$app/stores';
	import Clamp from '$components/Clamp.svelte';
	import { Button } from '$components/ui/button';
	import * as DropdownMenu from '$components/ui/dropdown-menu';
	import type Editor from '$components/ui/editor/Editor.svelte';
	import Separator from '$components/ui/Separator.svelte';
	import { dialog_store } from '$components/ui/singletons/Dialog.svelte';
	import Skeleton from '$components/ui/skeleton/Skeleton.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogTrigger,
	} from '$lib/components/ui/dialog';
	import Dialog2 from '$lib/components/ui/dialog2/Dialog.svelte';
	import {
		Tabs,
		TabsContent,
		TabsList,
		TabsTrigger,
	} from '$lib/components/ui/tabs';
	import { tabContent } from '$lib/components/ui/tabs/TabsContent.svelte';
	import { tabList } from '$lib/components/ui/tabs/TabsList.svelte';
	import { tabTrigger } from '$lib/components/ui/tabs/TabsTrigger.svelte';
	import { H1, Lead, Muted } from '$lib/components/ui/typography';
	import {
		deDupeGoogleBooksList,
		get_category,
		get_genre,
		getCategoryIcon,
	} from '$lib/features/books/utils';
	import { styleToString } from '$lib/helpers';
	import { queryFactory } from '$lib/queries/querykeys';
	import { receive, send } from '$lib/transitions';
	import { cn } from '$lib/utils/tailwind';

	import type { PageData } from './$types';
	import Annotation from './Annotation.svelte';
	import BookmarkForm from './BookmarkForm.svelte';
	import EntryOperations from './EntryOperations.svelte';
	import Interaction from './Interaction.svelte';
	import InteractionForm from './InteractionForm.svelte';
	import { onMount } from 'svelte';
	import type { FastAverageColorResult } from 'fast-average-color';

	let editor: Editor;

	type Book = PageData['book'];
	export let data: PageData & {
		book: NonNullable<Book>;
	};
	$: ({ book } = data);

	const strip_gbook_curl = (url: string) => {};

    const bookStore = writable(data.book);

    $: if (book !== undefined) {
        bookStore.set(book);
    }

	// TODO: should we do this or not?
	const imageColorQuery = createQuery(
		derived(bookStore, (boopk) => {
			return {
				enabled: !!book,
                // placeholderData: keepPreviousData,
				queryFn: async () => {
					if (!book) {
						return null;
					}
					const response = await fetch(
						`/api/color?uri=${encodeURIComponent(getGbookImage(book))}`,
					);
					if (!response.ok) {
						throw new Error('Network response was not ok');
					}
					return response.json() as Promise<FastAverageColorResult>;
				},
				queryKey: ['imageColor', getGbookImage(book)],
				staleTime: 1000 * 60 * 60 * 24,
			};
		}),
	);

    $: console.log({$imageColorQuery})

	$: firstAuthor = book.volumeInfo?.authors?.[0];

	$: otherBooksByAuthorQuery = createQuery({
		...queryFactory.search.books({
			q: `inauthor:"${firstAuthor}"`,
		}),
		enabled: !!firstAuthor,
		staleTime: 1000 * 60 * 60 * 24,
	});

	$: console.log({ $otherBooksByAuthorQuery });

	const boxShadowColor = derived(imageColorQuery, (result) => {
        console.log({ result });
		if (!result.data) {
			return null;
		}
		return result.data.hex;
	});

	$: isbn = book.volumeInfo?.industryIdentifiers?.find(
		(i) => i.type === 'ISBN_13',
	)?.identifier;

	$: author = book.volumeInfo?.authors?.join(', ');

	$: year = book.volumeInfo?.publishedDate?.split('-')[0];

	$: pageCount =
		book.volumeInfo?.printedPageCount || book.volumeInfo?.pageCount;

	function handleImgError(e: Event) {
		console.log(e, 'erro');
		const img = e.target as HTMLImageElement;
		img.src = data.book.volumeInfo?.imageLinks?.extraLarge ?? '';
	}

	function getGbookImage(book: NonNullable<Book>) {
		if (!book) {
			return '';
		}
		const { volumeInfo } = book;
		if (!volumeInfo) {
			return '';
		}
		const { imageLinks } = volumeInfo;
		if (!imageLinks) {
			return;
		}
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

	$: pdf = data.entry?.relations
		?.concat(data.entry?.back_relations ?? [])
		.find((r) => r.type === 'Grouped' && r.related_entry?.type === 'pdf');

	const {
		elements: { fallback, image },
		options,
		states: { loadingStatus },
	} = createAvatar();

	$: options.src.set(getGbookImage(book) ?? '');

	function assertBookWithVolumeInfo(
		book: Book,
	): asserts book is NonNullable<Book> & {
		volumeInfo: NonNullable<NonNullable<Book>['volumeInfo']>;
	} {
		if (!book?.volumeInfo) {
			throw new Error('Book has no volumeInfo');
		}
	}

	let category: ReturnType<typeof get_category> = undefined;
	$: category = get_category(book);
	$: categoryIcon = getCategoryIcon(category);
</script>

<div class="">
	<div class="flex select-text flex-col gap-4">
		<div class="flex items-center gap-6">
			<!-- src="https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg?default=false" -->
			<div
				class="aspect-auto max-w-[200px] shadow-lg shadow-stone-900 relative"
				style:--tw-shadow-color={$boxShadowColor}
				style:view-transition-name="artwork-{book.id}"
			>
				<img
					in:receive={{
						key: `book-${book.id}-image`,
					}}
					out:send={{
						key: `book-${book.id}-image`,
					}}
					use:melt={$image}
					class="aspect-auto max-w-[200px] shadow-xl"
					on:error={(e) => {
						console.log(e);
					}}
					src={book.image}
					alt=""
				/>
				<div class="absolute inset-0 book-cover-overlay"></div>
				<div
					class={cn(
						'w-[128px] h-[196px] bg-muted flex items-center justify-center text-muted-foreground',
						$loadingStatus === 'loading' && 'animate-pulse',
					)}
					use:melt={$fallback}
				>
					<!--  -->
					{#if $loadingStatus === 'error'}
						{book?.volumeInfo?.title}
					{/if}
				</div>
			</div>
			<div class="flex flex-col gap-2">
				<Muted>Book</Muted>
				<H1 class="font-serif drop-shadow-sm">{book.volumeInfo?.title}</H1>
				{#if book.volumeInfo?.subtitle}
					<Lead>{book.volumeInfo?.subtitle}</Lead>
				{/if}
				<span>
					{author}
				</span>
				<div class="flex items-center gap-x-4">
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
					{#if !!pdf}
						<!-- content here -->
						<Button as="a" href="/tests/pdf/{pdf.related_entry.id}">Read</Button
						>
					{/if}
					<!-- <BookmarkForm data={data.bookmarkForm} /> -->
					<div class="flex items-center">
						<Button
							size="sm"
							variant="default"
							class="rounded-r-none border-r-0"
						>
							{#if !data.entry?.bookmark}
								<BookPlusIcon class="mr-2 h-4 w-4" />
								Want to read
							{:else if !data.entry.interaction}
								<BookOpenIcon class="mr-2 h-4 w-4" />
								Update Progress
							{:else}
								{data.entry.interaction}
							{/if}
						</Button>
						<Separator orientation="vertical" />
						<DropdownMenu.Root>
							<DropdownMenu.Trigger let:builder asChild>
								<Button
									size="sm"
									variant="default"
									class="border-l-0 rounded-l-none"
									builders={[builder]}
								>
									<ChevronDown class="h-4 w-4" />
								</Button>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content class="w-56">
								<DropdownMenu.Item>
									<BookOpenIcon class="mr-2 h-4 w-4" />
									Mark as currently reading
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									<BookOpenCheckIcon class="mr-2 h-4 w-4" />
									Mark as read
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>
					{#if data.entry}
						<EntryOperations data={data.annotationForm} entry={data.entry} />
					{/if}
				</div>
			</div>
		</div>

		<div class="prose prose-stone mt-6 dark:prose-invert">
			<!-- this is the js-free version, but how's the a11y? -->
			<div class="not-prose">
				<h2 class="text-xl font-bold tracking-tight font-serif my-2">
					Publisher description
				</h2>
			</div>
			<Clamp clamp={6}>
				{@html book.volumeInfo?.description}
			</Clamp>

			<!-- {#if tab_param === 'interactions'}
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
                {/if} -->
		</div>
		{#if book.volumeInfo}
			<dl class="flex divide-x overflow-auto mt-6">
				<div class="flex flex-col gap-1 items-center pr-6">
					<dt
						class="text-xs font-medium text-muted-foreground uppercase tracking-wider"
					>
						Genre
					</dt>
					<dd class="flex flex-col items-center">
						{#if typeof categoryIcon === 'string'}
							{categoryIcon}
						{:else}
							<svelte:component this={categoryIcon} class="h-5 w-5" />
						{/if}
						<span class="text-sm font-medium text-center">{category}</span>
					</dd>
				</div>
				<div class="flex flex-col gap-1 items-center px-6">
					<dt
						class="text-xs font-medium text-muted-foreground uppercase tracking-wider"
					>
						Published
					</dt>
					<dd class="flex flex-col items-center">
						<span class="font-bold font-serif">{year}</span>
					</dd>
				</div>
				{#if pageCount}
					<div class="flex flex-col gap-1 items-center px-6">
						<dt
							class="text-xs font-medium text-muted-foreground uppercase tracking-wider"
						>
							Length
						</dt>
						<dd class="flex flex-col items-center">
							<span class="font-bold font-serif">{pageCount}</span><span
								class="text-sm font-medium text-center">pages</span
							>
						</dd>
					</div>
				{/if}
				<div class="flex flex-col gap-1 items-center px-6">
					<dt
						class="text-xs font-medium text-muted-foreground uppercase tracking-wider"
					>
						Publisher
					</dt>
					<dd class="flex flex-col items-center">
						<span class="font-bold font-serif text-center">
							{book.volumeInfo?.publisher}
						</span>
					</dd>
				</div>
				{#if book.volumeInfo.language}
					<div class="flex flex-col gap-1 items-center px-6">
						<dt
							class="text-xs font-medium text-muted-foreground uppercase tracking-wider"
						>
							Language
						</dt>
						<dd class="flex flex-col items-center">
							<span class="font-bold font-serif uppercase">
								{book.volumeInfo?.language}
							</span>
							<span class="text-sm font-medium">
								{ISO6391.getName(book.volumeInfo.language)}
							</span>
						</dd>
					</div>
				{/if}
				{#if isbn}
					<div class="flex flex-col gap-1 items-center px-6">
						<dt
							class="text-xs font-medium text-muted-foreground uppercase tracking-wider"
						>
							ISBN
						</dt>
						<dd class="flex flex-col items-center">
							<span class="text-sm font-medium">
								{isbn}
							</span>
						</dd>
					</div>
				{/if}
			</dl>
		{/if}
		<div class="flex flex-col">
			<h2 class="text-lg font-bold tracking-tight font-serif my-2">
				More Books by {firstAuthor}
			</h2>
			{#if $otherBooksByAuthorQuery.data}
				{@const books = $otherBooksByAuthorQuery.data ?? []}
				<div class="flex gap-6 overflow-auto py-6">
					{#each deDupeGoogleBooksList(books.filter((b) => b.volumeInfo && b.id !== book.id && b.volumeInfo.authors?.join('') === firstAuthor && b.volumeInfo.title !== book.volumeInfo.title)).slice(0, 20) as otherBook}
						{#if otherBook.volumeInfo}
							<a
								href="/tests/book/{otherBook.id}"
								class="flex flex-col min-w-0 w-20 gap-2 shrink-0"
							>
								{#if otherBook.volumeInfo.imageLinks}
									<div
										class="relative w-20 h-[121px] shadow-lg"
										style:view-transition-name="artwork-{otherBook.id}"
									>
										<img
											in:receive={{
												key: `booko-${otherBook.id}-image`,
											}}
											out:send={{
												key: `book-${otherBook.id}-image`,
											}}
											src={getGbookImage({
												...otherBook,
												volumeInfo: otherBook.volumeInfo,
											})}
											class="absolute w-20 h-[121px] object-cover"
											alt=""
										/>
										<div class="absolute inset-0 book-cover-overlay"></div>
									</div>
								{:else}
									<div
										class="relative w-full h-[121px] bg-gray-200 flex flex-col items-center justify-center"
									>
										<span class="text-gray-400 text-sm text-center font-bold"
											>No Image Available</span
										>
									</div>
								{/if}
								<div class="min-w-0 flex flex-col">
									<span class="truncate text-sm font-semibold"
										>{otherBook.volumeInfo.title}</span
									>
									<span class="truncate text-xs text-muted-foreground"
										>{otherBook.volumeInfo.authors}</span
									>
								</div>
							</a>
						{/if}
						<!-- <img src={getGbookImage(book)} alt="" /> -->
					{/each}
				</div>
			{:else if $otherBooksByAuthorQuery.isError}
				<!-- empty -->
			{:else}
				<div class="flex gap-6">
					{#each Array.from({ length: 8 }) as _}
						<Skeleton class="w-20 h-32" />
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- TODO: Other Books In Series -->
</div>

<style>
	img {
		/* view-transition-name: book; */
	}
	.book-cover-overlay {
		background: linear-gradient(
			to right,
			#000000d9 0px,
			rgba(255, 255, 255, 0.5) 5px,
			rgba(255, 255, 255, 0.25) 7px,
			rgba(255, 255, 255, 0.25) 10px,
			transparent 12px,
			transparent 16px,
			rgba(255, 255, 255, 0.25) 17px,
			transparent 22px
		);
		/* box-shadow:
			0 0 5px -1px black,
			inset -1px 1px 2px rgba(255, 255, 255, 0.5); */
	}
</style>
