<script lang="ts">
	import { createAvatar, melt } from '@melt-ui/svelte';
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

	import { page } from '$app/stores';
	import { Button } from '$components/ui/button';
	import * as DropdownMenu from '$components/ui/dropdown-menu';
	import type Editor from '$components/ui/editor/Editor.svelte';
	import Separator from '$components/ui/Separator.svelte';
	import { dialog_store } from '$components/ui/singletons/Dialog.svelte';
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
	import { get_genre } from '$lib/features/books/utils';
	import { cn } from '$lib/utils/tailwind';

	import type { PageData } from './$types';
	import Annotation from './Annotation.svelte';
	import BookmarkForm from './BookmarkForm.svelte';
	import EntryOperations from './EntryOperations.svelte';
	import Interaction from './Interaction.svelte';
	import InteractionForm from './InteractionForm.svelte';

	let editor: Editor;

	type Book = PageData['book'];
	export let data: PageData & {
		book: NonNullable<Book>;
	};
	$: ({ book } = data);

	const strip_gbook_curl = (url: string) => {};

	$: isbn = book.volumeInfo?.industryIdentifiers?.find(
		(i) => i.type === 'ISBN_13',
	)?.identifier;

	$: author = book.volumeInfo?.authors?.join(', ');

	$: year = book.volumeInfo?.publishedDate?.split('-')[0];

	function handleImgError(e: Event) {
		console.log(e, 'erro');
		const img = e.target as HTMLImageElement;
		img.src = data.book.volumeInfo?.imageLinks?.extraLarge ?? '';
	}

	function getGbookImage(book: NonNullable<Book>) {
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

	const tabs = ['Summary', 'Interactions', 'Notes'];

	$: tab_param = $page.url.searchParams.get('tab') ?? tabs[0].toLowerCase();

	$: pdf = data.entry?.relations
		?.concat(data.entry?.back_relations ?? [])
		.find((r) => r.type === 'Grouped' && r.related_entry?.type === 'pdf');

	const {
		elements: { fallback, image },
		options,
		states: { loadingStatus },
	} = createAvatar();

	$: options.src.set(getGbookImage(book) ?? '');
</script>

<div class="flex select-text flex-col gap-4">
	<div class="flex items-center gap-6">
		<!-- src="https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg?default=false" -->
		<div class="aspect-auto max-w-[200px] rounded-md shadow-lg">
			<img
				use:melt={$image}
				class="aspect-auto max-w-[200px] rounded-md shadow-lg"
				on:error={(e) => {
					console.log(e);
				}}
				src={getGbookImage(book)}
				alt=""
			/>
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
			<H1>{book.volumeInfo?.title}</H1>
			{#if book.volumeInfo?.subtitle}
				<Lead>{book.volumeInfo?.subtitle}</Lead>
			{/if}
			<span>
				{author} — {year}
			</span>
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
				{#if !!pdf}
					<!-- content here -->
					<Button as="a" href="/tests/pdf/{pdf.related_entry.id}">Read</Button>
				{/if}
				<!-- <BookmarkForm data={data.bookmarkForm} /> -->
				<div class="flex items-center">
					<Button size="sm" variant="default" class="rounded-r-none border-r-0">
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
				<div>
					{@html book.volumeInfo?.description}
				</div>
				<div>
					<span>genre</span>
					<Muted>
						{get_genre(book)}
						<!-- {boeok.volumeInfo?.categories?.join(', ')} -->
					</Muted>
				</div>
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
				<!-- <Dialog2>
					<svelte:fragment slot="trigger" let:trigger>
						<button class={buttonVariants()} melt={trigger}>
							<PlusCircle class="mr-2 h-4 w-4" />
							New note
						</button>
					</svelte:fragment>

					<Editor blank bind:this={editor} />

					<svelte:fragment slot="footer" let:open>
						<button
							class={buttonVariants()}
							on:click={() => {
								if (!data.entry) return;
								editor.saveNoteToEntry(data.entry.id);
								open.set(false);
							}}
						>
							Save
						</button>
					</svelte:fragment>
				</Dialog2>
				{#each data.entry?.annotations ?? [] as annotation}
					<Annotation
						data={data.annotationForm}
						entry={{
							id: data.entry?.id ?? 0
						}}
						{annotation}
					/>
				{/each} -->
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
