<script lang="ts" context="module">
	type State = {
		isOpen: boolean;
		pages: Array<
			| string
			| ComponentType
			| {
					component: ComponentType<SvelteComponent>;
					props?: ComponentProps<SvelteComponent>;
			  }
		>;
		placeholder: string;
		search: string;
		shouldFilter: boolean;
		allowPages?: boolean;
	};

	export function useCommanderContext() {
		const commander = getContext('commander');
		if (!commander) {
			throw new Error('Commander context not found');
		}
		return commander as Writable<State>;
	}

	// bad idea?
	const createState = () => {
		const state = writable<State>({
			isOpen: false,
			pages: [],
			placeholder: 'Type a command or search...',
			search: '',
			shouldFilter: true,
			allowPages: true,
		});

		return {
			...state,
			openFresh: () => {
				state.set({
					isOpen: true,
					pages: [],
					placeholder: 'Type a command or search...',
					search: '',
					shouldFilter: true,
					allowPages: true,
				});
			},
			addPage: <TComponent extends SvelteComponent>(
				page:
					| string
					| ComponentType
					| {
							component: ComponentType<TComponent>;
							props?: ComponentProps<TComponent>;
					  },
				opts?: Partial<State>,
			) => {
				if (typeof page === 'string') {
					state.update((s) => ({
						...s,
						...opts,
						pages: [...s.pages, page],
					}));
				} else {
					state.update((s) => ({
						...s,
						pages: [...s.pages, page],
					}));
				}
				transitionPage();
			},
		};
	};
	const state = createState();
	export { state as commanderState };

	let commandDialog: CommandDialog<unknown, any>;
	const inputValue = writable('');

	function transitionPage() {
		commandDialog.playBounce();
		inputValue.set('');
	}
</script>

<script lang="ts">
	import {
		ArrowRight,
		Cog,
		CreditCard,
		Search,
		Settings,
		StickyNote,
	} from 'lucide-svelte';
	import {
		type ComponentProps,
		type ComponentType,
		type SvelteComponent,
		getContext,
	} from 'svelte';
	import { derived, writable, type Writable } from 'svelte/store';

	import { goto } from '$app/navigation';
	import { page as spage } from '$app/stores';
	import { checkedEntryIds } from '$components/entries/multi-select';
	import SubCommand from '$components/sub-command.svelte';
	import Kbd from '$components/ui/KBD.svelte';
	import { Badge } from '$components/ui/badge';
	import { Button } from '$components/ui/button';
	import {
		Books,
		EntryCommands,
		Movies,
		Music,
		Podcasts,
		Subscriptions,
		Tags,
	} from '$lib/commands';
	import Annotations from '$lib/commands/Annotations.svelte';
	import Collections from '$lib/commands/Collections.svelte';
	import JumpToEntry from '$lib/commands/JumpToEntry.svelte';
	import EntryCommandItem from '$lib/commands/items/entry-command-item.svelte';
	import NoteCommandItem from '$lib/commands/items/note-command-item.svelte';
	import { cmd_open } from '$lib/components/ui/command/stores';
	import {
		CommandDialog,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList,
		CommandSeparator,
		CommandShortcut,
	} from '$lib/components/ui/command2';
	import { themes, updateTheme } from '$lib/features/settings/themes';
	import { objectEntries } from '$lib/helpers';
	import { createSetTagsMutation } from '$lib/queries/mutations';
	import { queryFactory } from '$lib/queries/querykeys';
	import { checkedCommandBadgeDisplay } from '$lib/stores/entry-state';
	import type { Commands } from '$lib/types/command';
	import { createQuery } from '@tanstack/svelte-query';

	const page = derived(state, ($state) => $state.pages.at(-1));
	const pages = derived(state, ($state) => $state.pages);

	// $: {
	// 	// Whenever a page changes...
	// 	// eslint-disable-next-line no-unused-expressions
	// 	$page;
	// 	inputValue.set('');
	// 	if ($page) {
	// 	}
	// }

	function addPage(page: string) {
		$state.pages = [...$state.pages, page];
		transitionPage();
	}

	const shouldFilter = writable(true);

	function back() {
		if (inEntryCommands) {
			entryCommands.back();
			transitionPage();
			return;
		}
		if ($state.allowPages === false) return;
		$state.pages = $state.pages.slice(0, -1);
		transitionPage();
		if ($state.pages.length === 0) {
			$shouldFilter = true;
		}
	}

	$: console.log({ pages: $state.pages });

	$: if (
		!$state.isOpen &&
		($inputValue || $state.allowPages || $state.pages.length)
	) {
		console.log('resetting');
		$state.pages = [];
		inputValue.set('');
		$state.allowPages = true;
		// setTimeout(() => {
		//     console.log('resetting in timeout')
		// }, 200);
	}

	export const open = () => {
		$state.isOpen = true;
	};

	state.subscribe((state) => {
		cmd_open.set(state.isOpen);
	});

	const placeholder = writable('Type a command or search...');

	$: if (!$page) {
		$state.shouldFilter = true;
		$shouldFilter = true;
		$placeholder = 'Type a command or search...';
	}

	$: console.log({ $page });

	$: console.log({ $shouldFilter });

	const container = writable<HTMLElement | null>(null);

	const setTagsMutation = createSetTagsMutation();

	let hideDefault = false;

	let inEntryCommands = false;
	$: console.log({ inEntryCommands });
	let entryCommands: EntryCommands;

	let subCommandOpen = false;
	let inputEl: HTMLInputElement;

	const defaultCommands: Array<Commands> = [];

	/** Fallback Searches */
	const fallbackQuery = createQuery(
		derived(inputValue, ($value) => ({
			...queryFactory.search.all({ q: $value }),
			enabled: $value.length > 2 && !inEntryCommands,
		})),
	);
</script>

<svelte:window
	on:keydown={(e) => {
		if ($state.isOpen) return;
		if (e.metaKey && e.key === 'k') {
			e.preventDefault();
			$state.isOpen = true;
		}
	}}
/>

<slot />

<!-- class="rounded-lg border border-gray-100  shadow-md  dark:border-gray-800" -->
<CommandDialog
	bind:this={commandDialog}
	{shouldFilter}
	bind:open={$state.isOpen}
	{inputValue}
	{container}
	{placeholder}
	commandPages={pages}
	let:selectActiveItem
	inert={subCommandOpen}
>
	{#if $checkedEntryIds.length}
		<div class="min-w-0 px-3 pt-3 text-xs text-muted-foreground">
			<Badge class="max-w-[85%]" variant="secondary">
				<span class="truncate">{$checkedCommandBadgeDisplay}</span>
			</Badge>
		</div>
	{/if}
	<CommandInput
		bind:inputEl
		onKeydown={(e) => {
			if (e.key === 'Escape' || (e.key === 'Backspace' && !$inputValue)) {
				e.preventDefault();
				back();
			}
		}}
	/>
	<CommandList class="scrollbar-hide">
		{#if !$page}
			<CommandEmpty>No results found.</CommandEmpty>
			{#if $spage.data.entry || $checkedEntryIds.length}
				{@const ids = $spage.data.entry?.id
					? [$spage.data.entry.id]
					: $checkedEntryIds}

				<EntryCommands
					{shouldFilter}
					on:transition={transitionPage}
					bind:this={entryCommands}
					bind:inPage={inEntryCommands}
					bind:open={$state.isOpen}
					entryIds={ids}
				/>
				<!-- <CommandGroup heading="Actions">
					<CommandItem
						onSeleect={() => {
							addPage('action:tag-item');
						}}
					>
						<TagIcon class="mr-2 h-4 w-4" />
						Tag</CommandItem
					>
				</CommandGroup> -->
			{/if}
			{#if !inEntryCommands}
				<CommandGroup heading="Navigation">
					<CommandItem
						onSelect={() => {
							addPage('open-item');
						}}
					>
						<ArrowRight class="mr-2 h-4 w-4" />
						<span>Open Item</span>
					</CommandItem>
					<CommandItem
						onSelect={() => {
							addPage('open-collection');
							$state.shouldFilter = false;
						}}
					>
						<ArrowRight class="mr-2 h-4 w-4" />
						<span>Open Collection</span>
					</CommandItem>
					<CommandItem
						onSelect={() => {
							addPage('open-subscription');
							$state.shouldFilter = false;
						}}
					>
						<ArrowRight class="mr-2 h-4 w-4" />
						<span>Open Subscription</span>
					</CommandItem>
					<CommandItem
						value="open jump go to note annotation"
						onSelect={() => {
							addPage('open-note');
							$placeholder = 'Open note...';
						}}
					>
						<ArrowRight class="mr-2 h-4 w-4" />
						<span>Open Note</span>
					</CommandItem>
					<CommandItem
						value="open jump go to tag"
						onSelect={() => {
							addPage('open-tag');
							$placeholder = 'Open tag...';
						}}
					>
						<ArrowRight class="mr-2 h-4 w-4" />
						<span>Open Tag</span>
					</CommandItem>
					<!-- <CommandSeparator /> -->
					{#each ['Now', 'Backlog', 'Archive'] as status}
						<CommandItem
							value="go to library {status}"
							onSelect={() => {
								goto(`/library/${status.toLowerCase()}`);
								$state.isOpen = false;
							}}
						>
							<ArrowRight class="mr-2 h-4 w-4" />
							<span>Go to {status}</span>
						</CommandItem>
					{/each}
					<!-- <CommandItem
						value="go to home"
						onSelect={() => {
							goto(`/home`);
							$state.isOpen = false;
						}}
					>
						<ArrowRight class="mr-2 h-4 w-4" />
						<span>Go to home</span>
					</CommandItem> -->
					<CommandItem
						value="go to advanced search"
						onSelect={() => {
							goto(`/search`);
							$state.isOpen = false;
						}}
					>
						<ArrowRight class="mr-2 h-4 w-4" />
						<span>Go to advanced Search</span>
					</CommandItem>
					<CommandItem
						value="go to srs flash cards memory palace"
						onSelect={() => {
							goto(`/srs`);
							$state.isOpen = false;
						}}
					>
						<ArrowRight class="mr-2 h-4 w-4" />
						<span>Go to SRS</span>
					</CommandItem>
					<CommandItem
						value="go to notes notebook"
						onSelect={() => {
							goto(`/notebook`);
							$state.isOpen = false;
						}}
					>
						<ArrowRight class="mr-2 h-4 w-4" />
						<span>Go to Notebook</span>
					</CommandItem>
					<CommandItem
						value="go to subscriptions"
						onSelect={() => {
							goto(`/subscriptions`);
							$state.isOpen = false;
						}}
					>
						<ArrowRight class="mr-2 h-4 w-4" />
						<span>Go to Subscriptions</span>
					</CommandItem>
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="Search">
					<CommandItem
						value="search movies tv"
						onSelect={() => {
							// goto(`/search`);
							// isOpen = false;
							addPage('search-movies');
							$placeholder = 'Open tag...';
						}}
					>
						<Search class="mr-2 h-4 w-4" />
						<span>Search moves and TV</span>
					</CommandItem>
					<CommandItem
						value="search books"
						onSelect={() => {
							addPage('search-books');
							$placeholder = 'Search books...';
						}}
					>
						<Search class="mr-2 h-4 w-4" />
						<span>Search books</span>
					</CommandItem>
					<CommandItem
						value="search music albums"
						onSelect={() => {
							// goto(`/search`);
							// isOpen = false;
							addPage('search-music');
							$placeholder = 'Search music...';
						}}
					>
						<Search class="mr-2 h-4 w-4" />
						<span>Search music</span>
					</CommandItem>
					<CommandItem
						value="search podcasts"
						onSelect={() => {
							// goto(`/search`);
							// isOpen = false;
							addPage('search-podcasts');
							$placeholder = 'Search podcasts...';
						}}
					>
						<Search class="mr-2 h-4 w-4" />
						<span>Search podcasts</span>
					</CommandItem>
				</CommandGroup>
				<CommandGroup heading="Create">
					<CommandItem
						onSelect={() => {
							goto(`/notes/new`);
							$state.isOpen = false;
						}}
					>
						<StickyNote class="mr-2 h-4 w-4" />
						Create note
					</CommandItem>
				</CommandGroup>
				<CommandGroup heading="Settings">
					<CommandItem
						onSelect={() => {
							addPage('theme');
							$placeholder = 'Change theme...';
						}}
					>
						<Cog class="mr-2 h-4 w-4" />
						<span>Change theme</span>
						<!-- <CommandShortcut>⌘P</CommandShortcut> -->
					</CommandItem>
					<CommandItem>
						<CreditCard class="mr-2 h-4 w-4" />
						<span>Billing</span>
						<CommandShortcut>⌘B</CommandShortcut>
					</CommandItem>
					<CommandItem>
						<Settings class="mr-2 h-4 w-4" />
						<span>Settings</span>
						<CommandShortcut>⌘S</CommandShortcut>
					</CommandItem>
				</CommandGroup>
				{#if $inputValue.length > 2}
					<CommandGroup alwaysShow heading={`Search for "${$inputValue}"`}>
						{#if $fallbackQuery.isPending}
							loading...
						{:else if $fallbackQuery.data}
							{#each $fallbackQuery.data as data}
								<!-- Give it inputValue to ensure it shows up (in future, do better!) -->
								{#if data.type === 'entry'}
									<EntryCommandItem
										value={$inputValue}
										bind:open={$state.isOpen}
										entry={data.data}
									/>
								{:else}
									<NoteCommandItem
										note={data.data}
										value={$inputValue}
										bind:open={$state.isOpen}
									/>
								{/if}
							{:else}{/each}
						{/if}
					</CommandGroup>
				{/if}
			{/if}
		{:else if typeof $page !== 'string'}
			{#if typeof $page === 'object' && 'component' in $page}
				<!-- {JSON.stringify($page)} -->
				<svelte:component this={$page.component} {...$page.props} bind:open={$state.isOpen} />
			{:else}
				<!-- <svelte:component this={$page} bind:open={$state.isOpen} /> -->
			{/if}
		{/if}
		{#if $page === 'theme'}
			<CommandGroup>
				{#each objectEntries(themes) as [name, theme]}
					<CommandItem
						onSelect={() => {
							updateTheme(theme);
							// console.log('fetching');
							fetch(
								`/s?/setTheme&theme=${theme}&redirectTo=${$spage.url.pathname}`,
								{
									body: new FormData(),
									method: 'POST',
								},
							).then(() => {
								// console.log('fetched');
								$state.isOpen = false;
							});
							$state.isOpen = false;
						}}
					>
						<Cog class="mr-2 h-4 w-4" />
						<span>{name}</span>
					</CommandItem>
				{/each}
			</CommandGroup>
		{/if}
		{#if $page === 'open-item'}
			<JumpToEntry preload bind:isOpen={$state.isOpen} />
		{/if}
		{#if $page === 'open-collection'}
			<Collections
				onSelect={(c) => {
					$state.isOpen = false;
					goto(`/collection/${c.id}`);
				}}
			/>
		{/if}
		{#if $page === 'open-subscription'}
			<Subscriptions bind:isOpen={$state.isOpen} />
		{/if}
		{#if $page === 'open-note'}
			<Annotations bind:isOpen={$state.isOpen} />
		{/if}
		{#if $page === 'search-movies'}
			<Movies bind:isOpen={$state.isOpen} />
		{/if}
		{#if $page === 'search-books'}
			<Books bind:isOpen={$state.isOpen} />
		{/if}
		{#if $page === 'search-podcasts'}
			<Podcasts bind:isOpen={$state.isOpen} />
		{/if}
		{#if $page === 'search-music'}
			<Music bind:isOpen={$state.isOpen} />
		{/if}
		{#if $page === 'open-tag'}
			<Tags preload bind:isOpen={$state.isOpen} />
		{/if}
		{#if $page === 'action:tag-item'}
			<Tags
				onSelect={(tags) => {
					const entries = $spage.data.entry?.id
						? [$spage.data.entry.id]
						: $checkedEntryIds;
					// TODO
					$setTagsMutation.mutate({
						entries,
						tags,
					});
				}}
				multiple
				bind:isOpen={$state.isOpen}
			/>
		{/if}

		<!-- this should be ELSE if -->
		{#if typeof $page === 'object'}{/if}
	</CommandList>
	<div
		data-command-footer
		class="flex h-10 w-full items-center justify-between border-t p-2"
	>
		<div />
		<div class="flex items-center gap-2">
			<Button
				on:click={selectActiveItem}
				size="sm"
				class="flex gap-1"
				variant="ghost"
			>
				<span>Open</span>
				<Kbd>↵</Kbd>
			</Button>
			<SubCommand
				on:close={() => {
					$state.isOpen = false;
				}}
				{inputEl}
				bind:open={subCommandOpen}
			/>
		</div>
	</div>
</CommandDialog>

<style lang="postcss">
	/* :global([data-cmdk-list]) {
		height: min(300px, var(--cmdk-list-height));
		max-height: 400px;
		overflow: auto;
		-ms-scroll-chaining: none;
		overscroll-behavior: contain;
		transition: 0.1s ease;
		transition-property: height;
	} */
</style>
