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

	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import Dialog from '$lib/components/ui/singletons/Dialog.svelte';

	// export let data;

	// $: isEntry = $page.route.id?.includes("entry");
	let isEntry = false;
	$: is_article = $page.url.pathname.startsWith('/tests/article') || $page.url.pathname.startsWith('/tests/pdf')
	$: is_settings = $page.url.pathname.startsWith('/tests/settings');

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
</script>

<QueryClientProvider client={data.queryClient}>
	{#if commander}
		<svelte:component this={commander} />
	{/if}
	<Dialog />	
	<GenericCommander>
		<div class="flex h-full grow flex-col space-y-6">
			<header class="container sticky top-0 z-40">
				<MainNav />
			</header>
			<div
				class={cn(
					'container grid grow',
					!isEntry && 'sm:grid-cols-[auto_1fr] lg:grid-cols-5',
					is_article && 'grid-cols-5'
				)}
			>
				<!-- w-[200px] -->
				<aside
					class={cn(
						'sticky top-20 hidden h-[calc(100vh-4.5rem)] flex-col self-start overflow-hidden sm:flex',
						isEntry && 'md:hidden',
						is_article && 'sm:hidden'
					)}
				>
					{#if $page.url.pathname.startsWith('/tests/settings')}
						<!-- todo -->
					{:else}
						<Nav user_data={data.user_data} />
					{/if}
				</aside>
				<main
					class={cn(
						'flex h-full w-full flex-1 flex-col px-4 py-6 lg:px-8',
						$page.url.pathname.startsWith('/tests/home') && 'overflow-x-hidden',
						is_article ? ' col-span-5' : 'lg:col-span-4',
						is_settings && 'border-none lg:col-span-3',
						!is_article && 'sm:border-l'
					)}
				>
					<slot />
				</main>
			</div>
		</div>
		<!-- <AudioPlayer /> -->
		<DropBox />
	</GenericCommander>
	<SvelteQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
