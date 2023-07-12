<script lang="ts" context="module">
	export type MenuBar = {
		/** Entry to display title of and use for EntryOperations */
		entry?: Pick<Entry, 'id' | 'title'>;
		/**
		 * Whether or not to show the center slot
		 */
		center: boolean;
		/**
		 * Whether or not to show the menu bar
		 */
		show: boolean;
		/**
		 * Html to display, instead of entry
		*/
		html?: string;
	};

	export function useMenuBar() {
		const menubar = getContext('mainnav');
		if (!menubar) {
			throw new Error('MainNav not found');
		}
		return menubar as Writable<MenuBar>;
	}
</script>

<script lang="ts">
	import { navigating, page } from '$app/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import Avatar from '$lib/components/ui/avatar/Avatar.svelte';
	import type { Entry } from '@prisma/client';
	import { ArrowLeft, ChevronRightSquare, Flower } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { Writable, derived } from 'svelte/store';
	import { fly } from 'svelte/transition';
	import { commanderState } from './Commander.svelte';
	import LoadingIndicator from './LoadingIndicator.svelte';

	const menu = useMenuBar();

	let timeout: number | NodeJS.Timeout;
	const delayed = derived(navigating, ($n, set) => {
		if ($n) {
			timeout = setTimeout(() => {
				set(true)
			}, 250);
		} else {
			clearTimeout(timeout);
			set(false)
		}
	}, false);
</script>

<div
	class="flex h-14 items-center justify-between border-b bg-background py-4 transition-transform duration-300 {$menu.show
		? ''
		: '-translate-y-full'}"
>
	<div class="flex grow items-center justify-between gap-6 md:gap-10">
		{#if !$page.route.id?.startsWith('/tests/(app2)/(listables)/[type=type]')}
			<a class="hidden items-center space-x-2 md:flex" href="/">
				<Flower class="transition {$delayed ? 'animate-spin' : ''}" />
				<span class="hidden font-bold sm:inline-block ">Margins</span>
				<!-- {#if $navigating}
					<LoadingIndicator />
				{/if} -->
			</a>
		{:else}
			<Button
				on:click={() => {
					history.back();
				}}
				variant="ghost"
				size="sm"
			>
				<ArrowLeft />
			</Button>
		{/if}
		<!-- logo -->
		<div class="flex grow line-clamp-2 justify-center text-xs md:text-sm lg:text-base">
			{#if $menu.center && $menu.entry?.title}
				<div transition:fly>
					{$menu.entry?.title}
				</div>
			{:else if $menu.center && $menu.html}
				<div transition:fly>
					{$menu.html}
				</div>
			{:else if $menu.center && $page.data.title}
				<div class="flex-grow ">
					{$page.data.title}
				</div>
			{/if}
		</div>
		<div class="flex items-center gap-x-4">
			<Button
				variant="outline"
				class="relative h-9 w-full flex items-center justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
				on:click={() => ($commanderState.isOpen = true)}
			>
				<span class="hidden lg:inline-flex">Go to anywhere...</span>
				<span class="inline-flex lg:hidden">Navigate...</span>
				<kbd
					class="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex"
				>
					<span class="text-xs">⌘</span>J
				</kbd>
			</Button>
			{#if $page.data.user_data}
				<a href="/tests/settings" class=" flex items-center space-x-2">
					<Avatar>
						<span>{$page.data.user_data.username.slice(0, 2)}</span>
					</Avatar>
				</a>
			{/if}
		</div>
		<!--  -->
	</div>
</div>
