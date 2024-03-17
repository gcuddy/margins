<script>
	import {
		Armchair,
		ChevronRight,
		Edit3,
		Glasses,
		Layers,
		Rss,
		Zap,
	} from 'lucide-svelte';

	import { buttonVariants } from '$components/ui/button';
	import { cn } from '$lib';

	import Anything from './anything.svelte';
</script>

<!-- TODO: replace with fontsource -->
<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<section class="space-y-6 pb-16 lg:py-16">
	<div
		class="container flex max-w-[64rem] flex-col items-center gap-4 text-center duration-1000 animate-in fade-in slide-in-from-top-4"
	>
		<!-- Link here to announcing open beta -->
		<h1
			class="header inline-block max-w-[20ch] text-balance py-4 font-sans text-[clamp(48px,7vw,140px)] font-normal leading-[95%]"
		>
			<!-- <h1 class="max-w-3xl text-center text-7xl font-extrabold text-amber-900"></h1> -->
			<span
				class="relative font-bold before:absolute before:-left-1 before:-top-px before:-z-10 before:h-full before:w-full before:rotate-1 before:rounded before:bg-primary/30 before:text-primary-foreground"
				>Margins
			</span>is the app for saving, consuming, and annotating
			<Anything />
		</h1>
		<p
			class=" mb-[1vw] leading-none tracking-normal sm:leading-8 md:text-[clamp(20px,1.5vw,26px)]"
		>
			A powerful, friendly research app.
		</p>
		<div class="space-x-4">
			<a
				href="/signup"
				class={cn(
					buttonVariants({ size: 'lg', variant: 'secondary' }),
					'h-12 rounded-full text-base font-medium transition hover:scale-105',
				)}
			>
				Get Margins <ChevronRight class="ml-1 h-4 w-4" />
			</a>
		</div>
	</div>
</section>
<section
	class="bg-trasparent container mt-[2vh] space-y-6 py-16 dark:bg-transparent md:py-12 lg:py-24"
>
	<div
		class="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center"
	>
		<h2
			class="header text-3xl font-normal leading-[1.1] sm:text-3xl md:text-6xl"
		>
			Features
		</h2>
		<p
			class="max-w-[45ch] text-xl leading-normal text-muted-foreground sm:leading-7"
		>
			An app designed for infovores, researchers, and anyone who wants to save
			and organize content.
		</p>
	</div>
	<ul
		class="mx-auto grid justify-center gap-4 px-2 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3"
	>
		<li class="relative overflow-hidden rounded-lg border bg-background p-2">
			<div class="flex h-[180px] flex-col justify-between rounded-md p-6">
				<Glasses class="h-12 w-12 shrink-0 stroke-1" />
				<div class="space-y-2">
					<h3 class="font-semibold">Read Later</h3>
					<span class="text-sm font-semibold text-muted-foreground"
						>Articles, videos, websites, documents and more.</span
					>
				</div>
			</div>
		</li>
		<li class="relative overflow-hidden rounded-lg border bg-background p-2">
			<div class="flex h-[180px] flex-col justify-between rounded-md p-6">
				<Rss class="h-12 w-12 shrink-0 stroke-1" />
				<div class="space-y-2">
					<h3 class="font-semibold">Subscriptions</h3>
					<span class="text-sm font-semibold text-muted-foreground"
						>Podcasts, RSS, emails, and anything you can throw at it.</span
					>
				</div>
			</div>
		</li>
		<li class="relative overflow-hidden rounded-lg border bg-background p-2">
			<div class="flex h-[180px] flex-col justify-between rounded-md p-6">
				<Edit3 class="h-12 w-12 shrink-0 stroke-1" />
				<div class="space-y-2">
					<h3 class="font-semibold">Annotate</h3>
					<span class="text-sm font-semibold text-muted-foreground"
						>Highlight, annotate, and share documents.</span
					>
				</div>
			</div>
		</li>
		<li class="relative overflow-hidden rounded-lg border bg-background p-2">
			<div class="flex h-[180px] flex-col justify-between rounded-md p-6">
				<Layers class="h-12 w-12 shrink-0 stroke-1" />
				<div class="space-y-2">
					<h3 class="font-semibold">Organize</h3>
					<span class="text-sm font-semibold text-muted-foreground"
						>Organize bookmarks into easily shareable collections and views.</span
					>
				</div>
			</div>
		</li>
		<li class="relative overflow-hidden rounded-lg border bg-background p-2">
			<div class="flex h-[180px] flex-col justify-between rounded-md p-6">
				<Armchair class="h-12 w-12 shrink-0 stroke-1" />
				<div class="space-y-2">
					<h3 class="font-semibold">Any Media</h3>
					<span class="text-sm font-semibold text-muted-foreground"
						>Track books, movies, TV, games, and more.</span
					>
				</div>
			</div>
		</li>
		<li class="relative overflow-hidden rounded-lg border bg-background p-2">
			<div class="flex h-[180px] flex-col justify-between rounded-md p-6">
				<Zap class="h-12 w-12 shrink-0 stroke-1" />
				<div class="space-y-2">
					<h3 class="font-semibold">Integrate</h3>
					<span class="text-sm font-semibold text-muted-foreground"
						>Integrate, export and share your notes.</span
					>
				</div>
			</div>
		</li>
	</ul>
</section>

<style>
	.header {
		font-family: 'Instrument Serif', serif;
	}
</style>
