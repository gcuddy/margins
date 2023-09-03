<script lang="ts">
	import { BookMarked, ChevronDown, FilmIcon, Library, PencilIcon, Plus } from 'lucide-svelte';
	import MarkdownIt from 'markdown-it';
	import { superForm } from 'sveltekit-superforms/client';

	import { invalidate, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import Tweet from '$components/Tweet.svelte';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardSkeleton,
		CardTitle
	} from '$components/ui/card';
	import OptionsMenu from '$components/ui/dropdown-menu/OptionsMenu.svelte';
	import rover from '$lib/actions/rover';
	import Annotations from '$lib/commands/Annotations.svelte';
	import { getCommanderContext } from '$lib/commands/GenericCommander.svelte';
	import JumpToEntry from '$lib/commands/JumpToEntry.svelte';
	import Media from '$lib/commands/Media.svelte';
	import EntryItem from '$lib/components/entries/EntryItem.svelte';
	import Annotation from '$lib/components/notebook/Annotation.svelte';
	import PinButton from '$lib/components/PinButton.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/Button.svelte';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuGroup,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import Input from '$lib/components/ui/input/input.svelte';
	import Separator from '$lib/components/ui/Separator.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import { H1 } from '$lib/components/ui/typography';
	import { mutation, query } from '$lib/queries/query';
	import { getId, make_link } from '$lib/utils/entries';
	import { cn } from '$lib/utils/tailwind';

	const md = new MarkdownIt();

	export let data;

	$: ({ pin_id } = data.collection);
	const commander = getCommanderContext();

	const { enhance, form } = superForm(data.form, {
		dataType: 'json'
	});
	let form_el: HTMLFormElement;
	let editing = false;


	function addEntry() {
		commander.open({
			component: JumpToEntry,
			placeholder: 'Search for an entry...',
			props: {
				onSelect: async (e) => {
					commander.close();
					await mutation($page, 'addToCollection', {
						collectionId: data.collection.id,
						entryId: e.id
					});
					// awaitinvalidate('entry');
					await invalidate('collection');
				}
			},
			shouldFilter: false
		});
	}
	function addNote() {
		commander.open({
			component: Annotations,
			placeholder: 'Search for a note...',
			props: {
				onSelect: async (a) => {
					commander.close();
					await mutation($page, 'addToCollection', {
						annotationId: [a.id],
						collectionId: data.collection.id
					});
					// awaitinvalidate('entry');
					await invalidate('collection');
				}
			},
			shouldFilter: false
		});
	}
	function addMedia(type = 'movie') {
		commander.open({
			component: Media,
			placeholder: `Search for a ${type}...`,
			props: {
				onSelect: async (a) => {
					commander.close();
					const entry = await query($page, 'findOrCreateEntry', {
						tmdbId: a.id
					});
					if (!entry) {return;}
					await mutation($page, 'addToCollection', {
						collectionId: data.collection.id,
						entryId: entry.id
					});
					await invalidate('collection');
				}
			},
			shouldFilter: false
		});
	}
</script>

<div class="flex items-center justify-between">
	<div class="flex items-center gap-x-2">
		{#if !editing}
			<H1>{data.collection.name}</H1>
			<Button on:click={() => (editing = !editing)} variant="secondary">
				<PencilIcon class="mr-2 h-4 w-4" /> Edit
			</Button>
		{:else}
			<form method="post" use:enhance action="?/edit">
				<Input
					class="h-auto text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl"
					bind:value={$form.name}
				/>
				<Button on:click={() => (editing = false)} variant="secondary">Save</Button>
			</form>
		{/if}
	</div>

	<div class="flex items-center gap-x-2">
		<div class="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
			<Button variant="secondary" on:click={addEntry}>
				<Plus class="mr-2 h-4 w-4" />
				Add
			</Button>
			<Separator orientation="vertical" class="h-[20px]" />
			<DropdownMenu>
				<DropdownMenuTrigger
					class={cn(
						buttonVariants({
							variant: 'secondary'
						}),
						'px-2'
					)}
				>
					<Button variant="secondary" class="px-2">
						<ChevronDown class="h-4 w-4 text-secondary-foreground" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent xoffset={-5} placement="bottom-end" class="w-[200px]">
					<DropdownMenuGroup>
						<DropdownMenuItem on:click={addEntry}>
							<Library class="mr-2 h-4 w-4" /> Entry
						</DropdownMenuItem>
						<DropdownMenuItem on:click={addNote}>
							<BookMarked class="mr-2 h-4 w-4" /> Note
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem on:click={() => addMedia('movie')}>
							<FilmIcon class="mr-2 h-4 w-4" /> Movie & TV
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
		<PinButton {pin_id} />
	</div>
</div>
<div class="mt-4">
	{#if editing}
		<form bind:this={form_el} use:enhance method="post" action="?/edit" class="contents">
			<Textarea
				on:blur={(e) => {
					console.log({ e });
					form_el.requestSubmit();
				}}
				bind:value={$form.description}
				placeholder="Description"
				rows={4}
				class="mt-2 h-auto max-w-prose"
			/>
			<noscript>
				<Button type="submit">Save</Button>
			</noscript>
		</form>
	{:else if $form.description}
		<div class="prose prose-sm prose-stone dark:prose-invert">
			{@html md.render($form.description)}
		</div>
	{/if}
</div>

<form action="?/add_section" method="post">
	<Button>Add section</Button>
</form>

<!-- {JSON.stringify(data.collection.items)} -->
<!-- grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))] -->
<div use:rover class="mt-8 flex flex-wrap gap-4">
	{#key data.collection}
		{#each data.collection.items as item, i}
			{#if item.type === 'Section'}
				Section
			{/if}
			<div class="w-48 space-y-3">
				<OptionsMenu variant="ghost" size="xs" items={[
					[
						{
							onSelect: () => {
								//todo
							},
							text: "Add note"
						}
					]
				]} />
				{#if item.entry?.type === 'tweet'}
					{@const id = item.entry?.uri?.split('/').pop()}
					{#if id}
						<Tweet {id} />
					{/if}
				{:else if item.entry}
					<div class="overflow-hidden rounded-md">
						<img class="aspect-square h-48 w-48 object-cover" alt="" src={item.entry?.image} />
					</div>
					<a href={make_link(item.entry)} class="text-sm font-medium">
						{item.entry?.title}
					</a>
				{:else if item.annotation}
					<div class="overflow-hidden rounded-md text-sm">
						{item.annotation.body}
					</div>
					<a href="" class="text-sm font-medium">
						{item.annotation.title}
					</a>
				{/if}
			</div>
			<!-- <Card class='w-72 space-y-3'>
				<CardContent class='overflow-hidden rounded-md'>
				</CardContent>
				<CardFooter class='shrink-0'>
					{item.entry?.title}
				</CardFooter>
			</Card> -->
			<!-- <div class="group grid grid-cols-1 grid-rows-5 h-72 w-72  overflow-hidden gap-y-4 p-4">
				{#if item.entry}
				<img class="row-span-5 object-contain" src={item.entry.image} />
					<div class="p-3 text-xs">
						{item.entry.title}
					</div>
				{:else if item.annotation}
					{#if item.annotation.type === 'annotation'}
						<Annotation annotation={item.annotation} />
					{:else}
						<a href="/tests/notes/{item.annotation.id}">{item.annotation.title}</a>
					{/if}
				{:else}
					{JSON.stringify(item)}
				{/if}
			</div> -->
		{/each}
	{/key}
</div>
<!-- {JSON.stringify(data.collection)} -->
