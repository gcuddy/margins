<script>
	import Button from "$lib/components/ui/Button.svelte";
	import {
		H1,
		H2,
		H3,
		Lead,
		Small,
		Subtle,
	} from "$lib/components/ui/typography";
	import { Image } from "@unpic/svelte";
	import { Armchair, Edit3, Glasses, Layers, Rss, Zap } from "lucide-svelte";
</script>

<section
	class="container grid items-center justify-center gap-6 pt-6 pb-8 md:pt-10 md:pb-12 lg:pt-16 lg:pb-24"
>
	<img
		width={500}
		height={500}
		class="mx-auto animate-in fade-in slide-in-from-top-2 duration-1000"
		src="/images/screenshot.jpg"
	/>
	<div
		class="item-start mx-auto flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-1000 lg:w-[52rem]"
	>
		<H1 class="">
			<!-- <h1 class="max-w-3xl text-center text-7xl font-extrabold text-amber-900"></h1> -->
			Margins is the app for saving, consuming, and annotating
			<em>anything</em>.
		</H1>
		<Lead>Discover the best way to organize your information inputs.</Lead>
	</div>
	<div class="flex gap-4">
		<Button size="lg" as="a" href="/signup">Get Margins</Button>
	</div>
</section>
<section class="container grid justify-center gap-6 py-8 md:py-12 lg:py-24">
	<H2 class="md:text-4xl">What can Margins do for you?</H2>
	<Lead>Quite a lot, actually.</Lead>
	<ul
		class="grid justify-center gap-4 sm:grid-cols-2 md:max-w-[56rem] md:grid-cols-3"
	>
		<div
			class="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-2 shadow-2xl"
		>
			<li
				class="flex h-[180px] flex-col justify-between rounded-md bg-black p-6 text-gray-200"
			>
				<Glasses class="h-12 w-12 shrink-0" />
				<div class="space-y-2">
					<h3 class="text-lg font-bold text-gray-100 md:text-xl">Read Later</h3>
					<span class="text-sm text-gray-200"
						>Articles, PDFs, videos, websites, documents and more.</span
					>
				</div>
			</li>
		</div>
		<div
			class="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-2 shadow-2xl"
		>
			<li
				class="flex h-[180px] flex-col justify-between rounded-md bg-black p-6 text-gray-200"
			>
				<Rss class="h-12 w-12 shrink-0" />
				<div class="space-y-2">
					<h3 class="text-lg font-bold text-gray-100 md:text-xl">
						Subscriptions
					</h3>
					<span class="text-sm text-gray-200"
						>Podcasts, RSS, emails, and anything you can throw at it.</span
					>
				</div>
			</li>
		</div>
		<div
			class="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-2 shadow-2xl"
		>
			<li
				class="flex h-[180px] flex-col justify-between rounded-md bg-black p-6 text-gray-200"
			>
				<Edit3 class="h-12 w-12 shrink-0" />
				<div class="space-y-2">
					<h3 class="text-lg font-bold text-gray-100 md:text-xl">Annotate</h3>
					<span class="text-sm text-gray-200"
						>Highlight, annotate, and share documents.</span
					>
				</div>
			</li>
		</div>
		<div
			class="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-2 shadow-2xl"
		>
			<li
				class="flex h-[180px] flex-col justify-between rounded-md bg-black p-6 text-gray-200"
			>
				<Layers class="h-12 w-12 shrink-0" />
				<div class="space-y-2">
					<h3 class="text-lg font-bold text-gray-100 md:text-xl">Organize</h3>
					<span class="text-sm text-gray-200"
						>Organize bookmarks into easily shareable collections and views.</span
					>
				</div>
			</li>
		</div>
		<div
			class="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-2 shadow-2xl"
		>
			<li
				class="flex h-[180px] flex-col justify-between rounded-md bg-black p-6 text-gray-200"
			>
				<Armchair class="h-12 w-12 shrink-0" />
				<div class="space-y-2">
					<h3 class="text-lg font-bold text-gray-100 md:text-xl">Any Media</h3>
					<span class="text-sm text-gray-200"
						>Track books, movies, TV, games, and more.</span
					>
				</div>
			</li>
		</div>
		<div
			class="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-2 shadow-2xl"
		>
			<li
				class="flex h-[180px] flex-col justify-between rounded-md bg-black p-6 text-gray-200"
			>
				<Zap class="h-12 w-12 shrink-0" />
				<div class="space-y-2">
					<h3 class="text-lg font-bold text-gray-100 md:text-xl">Integrate</h3>
					<span class="text-sm text-gray-200"
						>Integrate, export and share your notes.</span
					>
				</div>
			</li>
		</div>
	</ul>
</section>
