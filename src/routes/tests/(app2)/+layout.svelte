<script lang="ts">
	import 'katex/dist/katex.min.css';

	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { type ComponentType, onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';

	import { page } from '$app/stores';
	import { AddButton } from '$components';
	import GenericCommander from '$lib/commands/GenericCommander.svelte';
	import DropBox from '$lib/components/DragHelper/DropBox.svelte';
	import DialogStore from '$lib/components/ui/dialog2/DialogStore.svelte';
	import Dialog from '$lib/components/ui/singletons/Dialog.svelte';
	import { cn } from '$lib/utils/tailwind';

	import type { LayoutData } from './$types';
	import ClipboardHandler from './ClipboardHandler.svelte';
	import type { MenuBar } from './MainNav.svelte';
	import Nav from './Nav.svelte';
	import QueryClientPersister from './QueryClientPersister.svelte';

	// export let data;

	// $: isEntry = $page.route.id?.includes("entry");
	let isEntry = false;
	$: is_article =
		$page.url.pathname.startsWith('/tests/article') ||
		$page.url.pathname.startsWith('/tests/pdf');
	$: is_settings = $page.url.pathname.startsWith('/tests/settings');

	// Right now this is hardcoded...

	const is_entry = writable(false);
	setContext('is_entry', is_entry);
	$: $page.route.id?.startsWith(`/tests/(app2)/(listables)/[type=type]/[id]`)
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
		let module = await import('./Commander.svelte');
		commander = module.default;
	});

	const navWidth = writable(240);
	const mobileNavWidth = writable(81);
	setContext('mainNavWidth', navWidth);
	setContext('mobileNavWidth', mobileNavWidth);

	// queryclient

	const inArticle = writable(false);
	setContext('inArticle', inArticle);
	$: $inArticle =
		$page.url.pathname.startsWith('/tests/article') ||
		$page.url.pathname.startsWith('/tests/pdf');
</script>

<QueryClientPersister client={data.queryClient} let:isRestoring>
    <ClipboardHandler />
	{#if commander}
		<svelte:component this={commander} />
	{/if}
	<Dialog />
	<DialogStore />
	<GenericCommander>
		<div class="flex h-full grow flex-col" style:--nav-height="4rem">
			{#if !$is_entry}
				<!-- <header class="container sticky top-0 z-40">
					<MainNav />
				</header> -->
			{/if}
			<div class={cn('grid grid-cols-[auto,1fr,auto]')}>
				<!-- w-[200px] -->
				<div>
					<aside
						class={cn(
							'hidden h-full flex-col self-stretch grow overflow-hidden sm:flex',
							// isEntry && 'md:hidden',
							// is_article && 'sm:hidden'
						)}
					>
						{#if $page.url.pathname.startsWith('/tests/settings')}
							<!-- todo -->
						{:else}
							<Nav bind:width={$navWidth} user_data={data.user_data} />
						{/if}
					</aside>
				</div>
				<main
					class={cn(
						'flex h-full w-full flex-1 flex-col',
						$page.url.pathname.startsWith('/tests/home') && 'overflow-x-hidden',
						'relative',
						'col-start-2',
						// 'px-4 py-6 lg:px-8'
						// is_article ? ' col-span-5' : 'lg:col-span-4',
						// is_settings && 'border-none lg:col-span-3',
						// !is_article && 'sm:border-l'
					)}
				>
					<slot />
					{#if !is_entry && data.urlForm}
						<AddButton urlForm={data.urlForm} />
						<!--  -->
					{/if}
				</main>
			</div>
		</div>
		<!-- <AudioPlayer /> -->
		<DropBox />
	</GenericCommander>
	<SvelteQueryDevtools buttonPosition="bottom-right" />
</QueryClientPersister>
