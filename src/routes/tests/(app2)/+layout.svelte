<script lang="ts">
	import { page } from '$app/stores';
	import MainNav, { MenuBar } from './MainNav.svelte';
	import { cn } from '$lib/utils/tailwind';
	import { ComponentType, onMount, setContext } from 'svelte';
	import type Commander from './Commander.svelte';
	import Nav from './Nav.svelte';
	import { Readable, Writable, writable } from 'svelte/store';
	import type { LayoutData } from './$types';
	import GenericCommander from '$lib/commands/GenericCommander.svelte';
	import AudioPlayer from '$lib/components/AudioPlayer.svelte';
	import DropBox from '$lib/components/DragHelper/DropBox.svelte';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import 'katex/dist/katex.min.css';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import Dialog from '$lib/components/ui/singletons/Dialog.svelte';
	import DialogStore from '$lib/components/ui/dialog2/DialogStore.svelte';
	import QueryClientPersister from './QueryClientPersister.svelte';

	// export let data;

	// $: isEntry = $page.route.id?.includes("entry");
	let isEntry = false;
	$: is_article =
		$page.url.pathname.startsWith('/tests/article') || $page.url.pathname.startsWith('/tests/pdf');
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
		show: true,
		entry: undefined
	});
	setContext('mainnav', menu);

	// lazy load components?
	let commander: ComponentType<Commander> | undefined = undefined;
	onMount(async () => {
		let module = await import('./Commander.svelte');
		commander = module.default;
	});

	export let sidebar_width = 240;

	// queryclient

	const queryClient = data.queryClient;
</script>

<QueryClientPersister client={data.queryClient}>
	{#if commander}
		<svelte:component this={commander} />
	{/if}
	<Dialog />
	<DialogStore />
	<GenericCommander>
		<div class="flex h-full grow flex-col gap-y-6">
			{#if !$is_entry}
				<header class="container sticky top-0 z-40">
					<MainNav />
				</header>
			{/if}
			<div class={cn('container grid grid-cols-[auto,1fr,auto]')}>
				<!-- w-[200px] -->
				<aside
					class={cn(
						'sticky top-20 hidden h-[calc(100vh-4.5rem)] flex-col self-start overflow-hidden sm:flex'
						// isEntry && 'md:hidden',
						// is_article && 'sm:hidden'
					)}
				>
					{#if $page.url.pathname.startsWith('/tests/settings')}
						<!-- todo -->
					{:else}
						<Nav bind:width={sidebar_width} user_data={data.user_data} />
					{/if}
				</aside>
				<main
					class={cn(
						'flex h-full w-full flex-1 flex-col',
						$page.url.pathname.startsWith('/tests/home') && 'overflow-x-hidden',
						'relative',
						'col-start-2',
                        'h-[calc(100vh-4.5rem)]'
						// 'px-4 py-6 lg:px-8'
						// is_article ? ' col-span-5' : 'lg:col-span-4',
						// is_settings && 'border-none lg:col-span-3',
						// !is_article && 'sm:border-l'
					)}
				>
					<slot />
				</main>
			</div>
		</div>
		<!-- <AudioPlayer /> -->
		<DropBox />
	</GenericCommander>
    <SvelteQueryDevtools buttonPosition="bottom-right" />
</QueryClientPersister>
