<script>
	import { buttonVariants } from '$components/ui/button';
	import { cn } from '$lib';
	import {
		H2,
		Lead
	} from '$lib/components/ui/typography';
	import {
		Armchair,
		ChevronRight,
		Edit3,
		Glasses,
		Layers,
		Rss,
		Zap,
	} from 'lucide-svelte';
</script>

<section class="space-y-6 pb-16 pt-6 md:pt-10 lg:py-32">
	<div
		class="container flex max-w-[64rem] flex-col items-center gap-4 text-center animate-in fade-in slide-in-from-top-4 duration-1000"
	>
		<!-- Link here to announcing open beta -->
		<h1
			class="text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter font-bold"
		>
			<!-- <h1 class="max-w-3xl text-center text-7xl font-extrabold text-amber-900"></h1> -->
			Margins is the app for saving, consuming, and annotating
			<em>anything</em>.
		</h1>
		<p
			class="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8"
		>
			A powerful research app for slightly insane infovores.
		</p>
        <div class="space-x-4">
            <a href="/signup" class={cn(buttonVariants({ size: 'lg' }))}>
                Get Margins <ChevronRight class="w-4 h-4 ml-1" />
            </a>
        </div>
	</div>
	<!-- TODO: join waitlist -->
</section>
<section class="container space-y-6 bg-trasparent py-8 dark:bg-transparent md:py-12 lg:py-24">
    <div class="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 class="tracking-tight font-semibold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">Features</h2>
        <p class="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
           An app designed for infovores, researchers, and anyone who wants to save, organize, and annotate anything.
        </p>
    </div>
	<ul
		class="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3"
	>
		<li
			class="relative overflow-hidden rounded-lg border bg-background p-2"
		>
			<div
				class="flex h-[180px] flex-col justify-between rounded-md p-6"
			>
				<Glasses class="h-12 w-12 shrink-0" />
				<div class="space-y-2">
					<h3 class="font-bold">Read Later</h3>
					<span class="text-sm text-muted-foreground"
						>Articles, PDFs, videos, websites, documents and more.</span
					>
				</div>
			</div>
		</li>
		<li
			class="relative overflow-hidden rounded-lg border bg-background p-2"
		>
			<div
				class="flex h-[180px] flex-col justify-between rounded-md p-6"
			>
				<Rss class="h-12 w-12 shrink-0" />
				<div class="space-y-2">
					<h3 class="font-bold">Subscriptions</h3>
					<span class="text-sm text-muted-foreground"
						>Podcasts, RSS, emails, and anything you can throw at it.</span
					>
				</div>
			</div>
		</li>
        <li
			class="relative overflow-hidden rounded-lg border bg-background p-2"
		>
			<div
				class="flex h-[180px] flex-col justify-between rounded-md p-6"
			>
				<Edit3 class="h-12 w-12 shrink-0" />
				<div class="space-y-2">
					<h3 class="font-bold">Annotate</h3>
					<span class="text-sm text-muted-foreground"
						>Highlight, annotate, and share documents.</span
					>
				</div>
			</div>
		</li>
        <li
			class="relative overflow-hidden rounded-lg border bg-background p-2"
		>
			<div
				class="flex h-[180px] flex-col justify-between rounded-md p-6"
			>
				<Layers class="h-12 w-12 shrink-0" />
				<div class="space-y-2">
					<h3 class="font-bold">Organize</h3>
					<span class="text-sm text-muted-foreground"
						>Organize bookmarks into easily shareable collections and views.</span
					>
				</div>
			</div>
		</li>
        <li
			class="relative overflow-hidden rounded-lg border bg-background p-2"
		>
			<div
				class="flex h-[180px] flex-col justify-between rounded-md p-6"
			>
				<Armchair class="h-12 w-12 shrink-0" />
				<div class="space-y-2">
					<h3 class="font-bold">Any Media</h3>
					<span class="text-sm text-muted-foreground"
						>Track books, movies, TV, games, and more.</span
					>
				</div>
			</div>
		</li>
        <li
			class="relative overflow-hidden rounded-lg border bg-background p-2"
		>
			<div
				class="flex h-[180px] flex-col justify-between rounded-md p-6"
			>
				<Zap class="h-12 w-12 shrink-0" />
				<div class="space-y-2">
					<h3 class="font-bold">Integrate</h3>
					<span class="text-sm text-muted-foreground"
						>Integrate, export and share your notes.</span
					>
				</div>
			</div>
		</li>
	</ul>
</section>
