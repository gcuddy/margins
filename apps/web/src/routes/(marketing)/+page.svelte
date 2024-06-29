<script>
	import Armchair from 'lucide-svelte/icons/armchair';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import Edit3 from 'lucide-svelte/icons/pen-line';
	import Glasses from 'lucide-svelte/icons/glasses';
	import Layers from 'lucide-svelte/icons/layers';
	import Rss from 'lucide-svelte/icons/rss';
	import Zap from 'lucide-svelte/icons/zap';

	import { Badge, Button } from '@margins/ui';

	import Anything from './anything.svelte';
</script>

<section class="space-y-6 py-16">
	<div
		class="animate-in fade-in slide-in-from-top-4 container flex max-w-5xl flex-col items-center gap-4 text-center duration-1000"
	>
		<!-- Link here to announcing open beta -->
		<Badge
			variant="glass"
			href="/blog/2024-03-26-margins-alpha-01"
			class="h-7 rounded-full"
			>Margins Alpha v0.1 <ChevronRight class="h-3 w-3" /></Badge
		>
		<h1
			class="header inline-block max-w-[20ch] text-balance py-4 font-sans text-[clamp(48px,7vw,140px)] font-normal leading-none"
		>
			<!-- <h1 class="max-w-3xl text-center text-7xl font-extrabold text-amber-900"></h1> -->
			<span
				class="before:bg-accentA-5 before:text-accent-contrast relative font-bold before:absolute before:-left-1 before:-top-px before:-z-10 before:h-full before:w-full before:rotate-1 before:rounded"
				>Margins
			</span>is the app for saving, consuming, and annotating
			<Anything />
		</h1>
		<p
			class="mb-[1vw] leading-none tracking-normal sm:leading-8 md:text-[clamp(20px,1.5vw,26px)]"
		>
			A powerful, friendly research app.
		</p>
		<div class="marketing-button-container space-x-4">
			<Button variant="classic" href="/signup" size="xl" class="rounded-full marketing-button">
				Get Margins <ChevronRight class="ml-1 h-4 w-4" />
			</Button>
		</div>
	</div>
</section>
<div class="relative h-[9vh]">
	<div
		class="border-foreground/50 absolute left-1/2 -z-10 h-full w-px border-l border-dashed"
	/>
</div>
<section class="bg-trasparent container space-y-6 py-16 dark:bg-transparent">
	<div
		class="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center"
	>
		<h2
			class="header text-3xl font-normal leading-[1.1] sm:text-3xl md:text-6xl"
		>
			Features
		</h2>
		<p
			class="text-muted-foreground max-w-[45ch] text-xl leading-normal sm:leading-7"
		>
			An app designed for infovores, researchers, and anyone who wants to save
			and organize content.
		</p>
	</div>
	<ul
		class="mx-auto grid justify-center gap-4 px-2 sm:grid-cols-2 md:max-w-5xl md:grid-cols-3"
	>
		<li class="bg-background relative overflow-hidden rounded-lg border p-2">
			<div class="flex h-[180px] flex-col justify-between rounded-md p-6">
				<Glasses class="h-12 w-12 shrink-0 stroke-1" />
				<div class="space-y-2">
					<h3 class="font-semibold">Read Later</h3>
					<span class="text-muted-foreground text-sm font-semibold"
						>Articles, videos, websites, documents and more.</span
					>
				</div>
			</div>
		</li>
		<li class="bg-background relative overflow-hidden rounded-lg border p-2">
			<div class="flex h-[180px] flex-col justify-between rounded-md p-6">
				<Rss class="h-12 w-12 shrink-0 stroke-1" />
				<div class="space-y-2">
					<h3 class="font-semibold">Subscriptions</h3>
					<span class="text-muted-foreground text-sm font-semibold"
						>Podcasts, RSS, emails, and anything you can throw at it.</span
					>
				</div>
			</div>
		</li>
		<li class="bg-background relative overflow-hidden rounded-lg border p-2">
			<div class="flex h-[180px] flex-col justify-between rounded-md p-6">
				<Edit3 class="h-12 w-12 shrink-0 stroke-1" />
				<div class="space-y-2">
					<h3 class="font-semibold">Annotate</h3>
					<span class="text-muted-foreground text-sm font-semibold"
						>Highlight, annotate, and share documents.</span
					>
				</div>
			</div>
		</li>
		<li class="bg-background relative overflow-hidden rounded-lg border p-2">
			<div class="flex h-[180px] flex-col justify-between rounded-md p-6">
				<Layers class="h-12 w-12 shrink-0 stroke-1" />
				<div class="space-y-2">
					<h3 class="font-semibold">Organize</h3>
					<span class="text-muted-foreground text-sm font-semibold"
						>Organize bookmarks into easily shareable collections and views.</span
					>
				</div>
			</div>
		</li>
		<li class="bg-background relative overflow-hidden rounded-lg border p-2">
			<div class="flex h-[180px] flex-col justify-between rounded-md p-6">
				<Armchair class="h-12 w-12 shrink-0 stroke-1" />
				<div class="space-y-2">
					<h3 class="font-semibold">Any Media</h3>
					<span class="text-muted-foreground text-sm font-semibold"
						>Track books, movies, TV, games, and more.</span
					>
				</div>
			</div>
		</li>
		<li class="bg-background relative overflow-hidden rounded-lg border p-2">
			<div class="flex h-[180px] flex-col justify-between rounded-md p-6">
				<Zap class="h-12 w-12 shrink-0 stroke-1" />
				<div class="space-y-2">
					<h3 class="font-semibold">Integrate</h3>
					<span class="text-muted-foreground text-sm font-semibold"
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

	.marketing-button-container :global(.marketing-button) {
		box-shadow: -15px 0 30px -10px var(--amber-a7),0 0 30px -10px var(--grass-a7),15px 0 30px -10px var(--orange-a7),0 0 0 1px var(--grass-a4);
		transition: box-shadow .15s,transform .15s;

		&:hover {
			box-shadow: -15px 0 30px -10px var(--amber-a8),0 0 30px -10px var(--grass-a8),15px 0 30px -10px var(--orange-a8),0 0 0 1px var(--grass-a4);
		}
	}
</style>
