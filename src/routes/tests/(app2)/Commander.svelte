<script lang="ts" context="module">
	type State = {
		isOpen: boolean;
		search: string;
		pages: string[];
		shouldFilter: boolean;
		placeholder: string;
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
		search: '',
		pages: [],
		shouldFilter: true,
		placeholder: 'Type a command or search...'
	});
	export { state as commanderState };
</script>

<script lang="ts">
	import {
		CommandDialog,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList,
		CommandSeparator,
		CommandShortcut
	} from '$lib/components/ui/command';
	import { ArrowRight, Cog, CreditCard, Search, Settings } from 'lucide-svelte';
	import { Writable, derived, writable } from 'svelte/store';

	import { goto } from '$app/navigation';
	import { page as spage } from '$app/stores';
	import Annotations from '$lib/commands/Annotations.svelte';
	import Collections from '$lib/commands/Collections.svelte';
	import JumpToEntry from '$lib/commands/JumpToEntry.svelte';
	import Media from '$lib/commands/Media.svelte';
	import Query from '$lib/commands/Query.svelte';
	import { query } from '$lib/queries/query';
	import { queryKeys } from '$lib/queries/keys';
	import { darkThemes } from '$lib/features/settings/themes';
	import { getContext } from 'svelte';
	import { cmd_open } from '$lib/components/ui/command/stores';

	;


	const page = derived(state, ($state) => $state.pages[$state.pages.length - 1]);
	$: $page, ($state.search = '');

	$: if (!$state.isOpen) {
		$state.pages = [];
		$state.search = '';
	}

	export const open = () => {
		$state.isOpen = true;
	};

	state.subscribe((state) => {
		cmd_open.set(state.isOpen);
	})


	$: if (!$page) {
		$state.shouldFilter = true;
		$state.placeholder = 'Type a command or search...';
	}

	$: console.log({
		$state
	})
</script>

<svelte:window
	on:keydown={(e) => {
		// listen for command + j
		if (e.metaKey && e.key === 'j') {
			$state.isOpen = true;
		}
	}}
/>

<slot />

<!-- class="rounded-lg border border-gray-100  shadow-md  dark:border-gray-800" -->
<CommandDialog
	shouldFilter={$state.shouldFilter}
	bind:isOpen={$state.isOpen}
	onKeydown={(e) => {
		if (e.key === 'Escape' || (e.key === 'Backspace' && !$state.search)) {
			e.preventDefault();
			$state.pages = $state.pages.slice(0, -1);
		}
	}}
>
	<CommandInput bind:value={$state.search} placeholder={$state.placeholder} />
	<CommandList class="scrollbar-hide">
		{#if !$page}
			<CommandEmpty>No results found.</CommandEmpty>
			<CommandGroup heading="Navigation">
				<CommandItem
					onSelect={() => {
						$state.pages = [...$state.pages, 'open-item'];
						$state.shouldFilter = false;
					}}
				>
					<ArrowRight class="mr-2 h-4 w-4" />
					<span>Open Item</span>
				</CommandItem>
				<CommandItem
					onSelect={() => {
						$state.pages = [...$state.pages, 'open-collection'];
					$state.shouldFilter = false;
					}}
				>
					<ArrowRight class="mr-2 h-4 w-4" />
					<span>Open Collection</span>
				</CommandItem>
				<CommandItem
					value="open jump go to note annotation"
					onSelect={() => {
						$state.pages = [...$state.pages, 'open-note'];
						$state.shouldFilter = false;
						$state.placeholder = 'Open note...';
					}}
				>
					<ArrowRight class="mr-2 h-4 w-4" />
					<span>Open Note</span>
				</CommandItem>
				<CommandItem
					value="open jump go to tag"
					onSelect={() => {
						$state.pages = [...$state.pages, 'open-tag'];
						$state.shouldFilter = true;
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
							goto(`/tests/library/${status.toLowerCase()}`);
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
						goto(`/tests/home`);
						$state.isOpen = false;
					}}
				>
					<ArrowRight class="mr-2 h-4 w-4" />
					<span>Go to home</span>
				</CommandItem>
				<CommandItem
					value="go to advanced search"
					onSelect={() => {
						goto(`/tests/search`);
						$state.isOpen = false;
					}}
				>
					<ArrowRight class="mr-2 h-4 w-4" />
					<span>Go to advanced Search</span>
				</CommandItem>
				<CommandItem
					value="go to srs flash cards memory palace"
					onSelect={() => {
						goto(`/tests/srs`);
						$state.isOpen = false;
					}}
				>
					<ArrowRight class="mr-2 h-4 w-4" />
					<span>Go to SRS</span>
				</CommandItem>
			</CommandGroup>
			<CommandSeparator />
			<CommandGroup heading="Search">
				<CommandItem
					value="search movies"
					onSelect={() => {
						// goto(`/tests/search`);
						// isOpen = false;
						$state.pages = [...$state.pages, 'search-movies'];
						$state.shouldFilter = false;
					}}
				>
					<Search class="mr-2 h-4 w-4" />
					<span>Search movies</span>
				</CommandItem>
				<CommandItem
					value="search books"
					onSelect={() => {
						// goto(`/tests/search`);
						// isOpen = false;
						$state.pages = [...$state.pages, 'search-books'];
						$state.shouldFilter = false;
					}}
				>
					<Search class="mr-2 h-4 w-4" />
					<span>Search books</span>
				</CommandItem>
				<CommandItem
					value="search music albums"
					onSelect={() => {
						// goto(`/tests/search`);
						// isOpen = false;
						$state.pages = [...$state.pages, 'search-music'];
						$state.shouldFilter = false;
					}}
				>
					<Search class="mr-2 h-4 w-4" />
					<span>Search music</span>
				</CommandItem>
			</CommandGroup>
			<CommandGroup heading="Settings">
				<CommandItem onSelect={() => ($state.pages = [...$state.pages, 'theme'])}>
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
				{#each ['Dark', 'Light', 'System', 'Synthwave'] as Theme}
					{@const theme = Theme.toLowerCase()}
					<CommandItem
						onSelect={() => {
							if (theme === 'system') {
								document.documentElement.removeAttribute('data-theme');
							} else {
								document.documentElement.setAttribute('data-theme', theme);
							}
							if (darkThemes.includes(theme)) {
								document.documentElement.classList.add('dark');
							} else {
								document.documentElement.classList.remove('dark');
							}
						console.log('fetching')
							fetch(`/tests?/setTheme&theme=${theme}&redirectTo=` + $spage.url.pathname, {
								method: 'POST',
								body: new FormData()
							}).then(() => {
								console.log('fetched')
								$state.isOpen = false;
							});
							$state.isOpen = false;
						}}
					>
						<Cog class="mr-2 h-4 w-4" />
						<span>{Theme}</span>
					</CommandItem>
				{/each}
			</CommandGroup>
		{/if}
		{#if $page === 'open-item'}
			<JumpToEntry bind:isOpen={$state.isOpen} />
		{/if}
		{#if $page === 'open-collection'}
			<Collections
				onSelect={(c) => {
					$state.isOpen = false;
					goto(`/tests/collection/${c.id}`);
				}}
			/>
		{/if}
		{#if $page === 'open-note'}
			<Annotations bind:isOpen={$state.isOpen} />
		{/if}
		{#if $page === 'search-movies'}
			<Media type="searchMovies" />
		{/if}
		{#if $page === 'search-books'}
			<Query
				opts={{
					...queryKeys.search.books($spage, $state.search),
					enabled: !!$state.search
				}}
				display={(b) => b.volumeInfo?.title ?? ''}
				value={(b) =>
					`${b.volumeInfo?.title} ${b.volumeInfo?.authors} ${b.volumeInfo?.publishedDate}`}
			/>
		{/if}
		{#if $page === 'search-music'}
			<Query
				opts={{
					...queryKeys.search.music($spage, $state.search),
					enabled: !!$state.search,
				}}
				value={(item) => item.name}
				display={(item) => item.name}
				image={(item) => item.images[0].url}
				onSelect={(item) => {
					$state.isOpen = false;
					goto(`/tests/album/${item.id}`);
				}}
			/>
		{/if}
		{#if $page === 'open-tag'}
			<Query
				opts={{
					queryKey: ['tags'],
					queryFn: () => query($spage, 'tags', {})
				}}
				value={(item) => item.name}
				display={(item) => item.name}
				onSelect={(item) => {
					$state.isOpen = false;
					goto(`/tests/tag/${item.name}`);
				}}
			/>
		{/if}
	</CommandList>
</CommandDialog>

<style>
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
