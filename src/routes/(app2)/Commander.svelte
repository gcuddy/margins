<script lang="ts" context="module">
	type State = {
		isOpen: boolean;
		pages: Array<string>;
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
	const state = writable<State>({
		isOpen: false,
		pages: [],
		placeholder: 'Type a command or search...',
		search: '',
		shouldFilter: true,
        allowPages: true,
	});
	export { state as commanderState };
</script>

<script lang="ts">
	import {
		ArrowRight,
		Cog,
		CreditCard,
		Search,
		Settings,
		TagIcon,
	} from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { derived, type Writable, writable } from 'svelte/store';

	import { goto } from '$app/navigation';
	import { page as spage } from '$app/stores';
	import { Books, Music, Movies, Subscriptions, Tags } from '$lib/commands';
	import Annotations from '$lib/commands/Annotations.svelte';
	import Collections from '$lib/commands/Collections.svelte';
	import JumpToEntry from '$lib/commands/JumpToEntry.svelte';
	import Query from '$lib/commands/Query.svelte';
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
	import { darkThemes, themes, updateTheme } from '$lib/features/settings/themes';
	import { queryKeys } from '$lib/queries/keys';
	import { checkedEntryIds } from '$components/entries/multi-select';
	import { Badge } from '$components/ui/badge';
	import { createSetTagsMutation } from '$lib/queries/mutations';
	import { objectEntries } from '$lib/helpers';

	const page = derived(state, ($state) => $state.pages.at(-1));
	const pages = derived(state, ($state) => $state.pages);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let commandDialog: CommandDialog<unknown, any>;

	// $: {
	// 	// Whenever a page changes...
	// 	// eslint-disable-next-line no-unused-expressions
	// 	$page;
	// 	inputValue.set('');
	// 	if ($page) {
	// 	}
	// }

	const shouldFilter = writable(true);

	function transitionPage() {
		commandDialog.playBounce();
		inputValue.set('');
	}

	function addPage(page: string) {
		$state.pages = [...$state.pages, page];
		transitionPage();
	}
	function back() {
        if ($state.allowPages === false) return;
		$state.pages = $state.pages.slice(0, -1);
		transitionPage();
		if ($state.pages.length === 0) {
			$shouldFilter = true;
		}
	}

    $: console.log({pages: $state.pages})

	$: if (!$state.isOpen && ($inputValue || $state.allowPages || $state.pages.length)) {
        console.log('resetting')
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

	$: if (!$page) {
		$state.shouldFilter = true;
		$shouldFilter = true;
		$state.placeholder = 'Type a command or search...';
	}

	// $: console.log({ $shouldFilter });

	const inputValue = writable('');
	const container = writable<HTMLElement | null>(null);

    const setTagsMutation = createSetTagsMutation();
</script>

<svelte:window
	on:keydown={(e) => {
		// listen for command + j
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
	commandPages={pages}
>
	<!-- {#if $checkedEntryIds.length}
		<div class="text-xs text-muted-foreground px-3 pt-3">
			<Badge class="text-xs" variant="secondary">{$checkedEntryIds.length} entries</Badge>
		</div>
	{/if} -->
	<CommandInput
		onKeydown={(e) => {
			if (e.key === 'Escape' || (e.key === 'Backspace' && !$inputValue)) {
				e.preventDefault();
				back();
			}
		}}
		placeholder={$state.placeholder}
	/>
	<CommandList class="scrollbar-hide">
		{#if !$page}
			<CommandEmpty>No results found.</CommandEmpty>
			{#if $spage.data.entry || $checkedEntryIds.length}
				{@const ids = $spage.data.entry?.id
					? [$spage.data.entry.id]
					: $checkedEntryIds}
				<CommandGroup heading="Actions">
					<CommandItem
						onSelect={() => {
							addPage('action:tag-item');
						}}
					>
						<TagIcon class="mr-2 h-4 w-4" />
						Tag</CommandItem
					>
				</CommandGroup>
			{/if}
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
						$state.placeholder = 'Open note...';
					}}
				>
					<ArrowRight class="mr-2 h-4 w-4" />
					<span>Open Note</span>
				</CommandItem>
				<CommandItem
					value="open jump go to tag"
					onSelect={() => {
						addPage('open-tag');
						$state.placeholder = 'Open tag...';
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
				<CommandItem
					value="go to home"
					onSelect={() => {
						goto(`/home`);
						$state.isOpen = false;
					}}
				>
					<ArrowRight class="mr-2 h-4 w-4" />
					<span>Go to home</span>
				</CommandItem>
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
					value="search movies"
					onSelect={() => {
						// goto(`/search`);
						// isOpen = false;
						addPage('search-movies');
						$state.placeholder = 'Open tag...';
					}}
				>
					<Search class="mr-2 h-4 w-4" />
					<span>Search movies</span>
				</CommandItem>
				<CommandItem
					value="search books"
					onSelect={() => {
						addPage('search-books');
						$state.placeholder = 'Search books...';
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
                        addPage('search-music')
                        $state.placeholder = "Search music..."
					}}
				>
					<Search class="mr-2 h-4 w-4" />
					<span>Search music</span>
				</CommandItem>
			</CommandGroup>
			<CommandGroup heading="Settings">
				<CommandItem
					onSelect={() => {
                        addPage('theme')
                        $state.placeholder = "Change theme..."
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
		{#if $page === 'search-music'}
        <Music bind:isOpen={$state.isOpen} />
		{/if}
		{#if $page === 'open-tag'}
			<Tags preload bind:isOpen={$state.isOpen} />
		{/if}
		{#if $page === 'action:tag-item'}
			<Tags onSelect={(tags) => {
                const entries = $spage.data.entry?.id ? [$spage.data.entry.id] : $checkedEntryIds;
                // TODO
                $setTagsMutation.mutate({
                    entries,
                    tags
                })
            }} multiple bind:isOpen={$state.isOpen} />
		{/if}
	</CommandList>
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