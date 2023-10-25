<script lang="ts">
	import 'katex/dist/katex.min.css';

	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { type ComponentType, onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';

	import { navigating, page } from '$app/stores';
	import GenericCommander from '$lib/commands/GenericCommander.svelte';
	import DropBox from '$lib/components/DragHelper/DropBox.svelte';
	import DialogStore from '$lib/components/ui/dialog2/DialogStore.svelte';
	import Dialog from '$lib/components/ui/singletons/Dialog.svelte';
	import { cn } from '$lib/utils/tailwind';
	import AudioPlayer, { audioPlayer } from '$lib/components/AudioPlayer.svelte';

	import type { LayoutData } from './$types';
	import ClipboardHandler from './ClipboardHandler.svelte';
	import type { MenuBar } from './MainNav.svelte';
	import Nav from './Nav.svelte';
	import QueryClientPersister from './QueryClientPersister.svelte';
	import ViewTransitions from '$components/ViewTransitions.svelte';
	import AlertDialogHelper from '$components/helpers/AlertDialogHelper.svelte';
	import alertDialogStore from '$lib/stores/alert-dialog';
	import MobileNav from './mobile-nav.svelte';
	import { inArticle } from '$lib/stores/entry';
	import PreloadingIndicator from '$components/PreloadingIndicator.svelte';
	import { mainClassStore } from '$lib/stores/main';

	$: console.log({ $navigating, $page });

	// export let data;

	// Right now this is hardcoded...

	const is_entry = writable(false);
	setContext('is_entry', is_entry);
	// eslint-disable-next-line no-unused-expressions
	$: $page.route.id?.startsWith(`/(app2)/(listables)/[type=type]/[id]`)
		? is_entry.set(true)
		: is_entry.set(false);

	export let data: LayoutData;

	const menu = writable<MenuBar>({
		center: false,
		entry: undefined,
		show: true,
	});
	setContext('mainnav', menu);

	// lazy load components?
	let commander: ComponentType | undefined = undefined;
	onMount(async () => {
		const module = await import('./Commander.svelte');
		commander = module.default;
	});

	const navWidth = writable(240);
	const mobileNavWidth = writable(81);
	setContext('mainNavWidth', navWidth);
	setContext('mobileNavWidth', mobileNavWidth);

	// queryclient

	setContext('inArticle', inArticle);
	$: $inArticle =
		$page.url.pathname.startsWith('/article') ||
		$page.url.pathname.startsWith('/pdf');
</script>

<QueryClientPersister client={data.queryClient} let:isRestoring>
	<ViewTransitions>
		<ClipboardHandler />
		{#if commander}
			<svelte:component this={commander} />
		{/if}
		<Dialog />
		<DialogStore />
		<GenericCommander>
			<div class="flex h-full grow flex-col relative" style:--nav-height="4rem">
				{#if $navigating}
					<PreloadingIndicator />
				{/if}
				{#if !$is_entry}
					<!-- <header class="container sticky top-0 z-40">
					<MainNav />
				</header> -->
				{/if}
				<!-- when small, make bottom padding space for mobile nav -->
				<div class={cn('sm:grid grid-cols-[auto,1fr,auto] grow max-sm:pb-16')}>
					<!-- w-[200px] -->
					<div>
						<aside
							class={cn(
								'hidden h-full flex-col self-stretch grow overflow-hidden sm:flex',
								// isEntry && 'md:hidden',
								// is_article && 'sm:hidden'
							)}
						>
							{#if $page.url.pathname.startsWith('/settings')}
								<!-- todo -->
							{:else}
								<Nav bind:width={$navWidth} user_data={data.user_data} />
							{/if}
						</aside>
						<MobileNav />
					</div>
					<main
						class={cn(
							'flex h-full w-full flex-1 flex-col',
							// $page.url.pathname.startsWith('/home') && 'overflow-x-hidden',
							'relative',
							'col-start-2',
                            $mainClassStore
							// 'px-4 py-6 lg:px-8'
							// is_article ? ' col-span-5' : 'lg:col-span-4',
							// is_settings && 'border-none lg:col-span-3',
							// !is_article && 'sm:border-l'
						)}
						style:padding-bottom="{$audioPlayer.height}px"
					>
						<slot />
						<!-- {#if !is_entry && data.urlForm}
						<AddButton urlForm={data.urlForm} />
					{/if} -->
					</main>
				</div>
			</div>
			<!-- <AudioPlayer /> -->
			<DropBox />
			<AudioPlayer />
			<!-- <div
				class="mt-auto flex shrink-0 flex-col pb-2 max-w-[--width] {collapsed
					? ''
					: 'mt-auto border-t'}"
			>
			</div> -->
		</GenericCommander>
		<AlertDialogHelper store={alertDialogStore} />
	</ViewTransitions>
	<SvelteQueryDevtools buttonPosition="bottom-right" />
</QueryClientPersister>
