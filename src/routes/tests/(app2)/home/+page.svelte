<script lang="ts">
	import { goto } from '$app/navigation';
	import EntryIcon from '$lib/components/entries/EntryIcon.svelte';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import { H1, H2, Muted } from '$lib/components/ui/typography';
	import { getHostname } from '$lib/utils';
	import { getId } from '$lib/utils/entries';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="overflow-x-hidden">
	<div class="flex items-center justify-between">
		<H1>Home</H1>
		<DropdownMenu>
			<DropdownMenuTrigger>menu</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem on:click={() => goto('/tests/home/edit')}>Edit</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	</div>
	<H2>Recents</H2>
	<div
		class="flex snap-x snap-mandatory scroll-pl-2 gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain whitespace-nowrap scrollbar-hide"
	>
		{#each data.recents as recent}
			<a href="/tests/{recent.type}/{getId(recent)}" class="w-36 shrink-0 snap-start space-y-3 p-2">
				<img
					class="aspect-square w-32 rounded-lg border object-cover shadow"
					src={recent.image ??
						(recent.uri ? `https://icon.horse/icon/${getHostname(recent.uri)}` : '')}
					alt={recent.title}
				/>
				<div class="flex flex-col whitespace-normal">
					<span class="line-clamp-3 font-medium leading-none">{recent.title}</span>
					<Muted class="line-clamp-2">{recent.author}</Muted>
				</div>
			</a>
		{/each}
	</div>
	<H2>Now</H2>
	<div
		class="flex snap-x snap-mandatory scroll-pl-2 gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain whitespace-nowrap scrollbar-hide"
	>
		{#each data.now as recent}
			<a
				href="/tests/{recent.type}/{getId(recent)}"
				class="relative flex w-36 shrink-0 snap-start flex-col gap-y-3 p-2"
			>
				<div class="absolute left-0 top-0 rounded-full bg-accent p-1.5">
					<EntryIcon type={recent.type} class="h-3 w-3" />
					<span class="sr-only text-xs">{recent.type}</span>
				</div>
				<img
					class="aspect-square w-32 rounded-lg border object-cover shadow"
					src={recent.image ??
						(recent.uri ? `https://icon.horse/icon/${getHostname(recent.uri)}` : '')}
					alt={recent.title}
				/>
				<div class="flex flex-col whitespace-normal">
					<span class="line-clamp-3 font-medium leading-none">{recent.title}</span>
					<Muted class="line-clamp-2">{recent.author}</Muted>
				</div>
			</a>
		{/each}
	</div>
	<H2>Recently Saved</H2>
	<div
		class="flex snap-x snap-mandatory scroll-pl-2 gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain whitespace-nowrap scrollbar-hide"
	>
		{#each data.recently_saved as recent}
			<a
				href="/tests/{recent.type}/{getId(recent)}"
				class="relative flex w-36 shrink-0 snap-start flex-col gap-y-3 p-2"
			>
				<div class="absolute left-0 top-0 rounded-full bg-accent p-1.5">
					<EntryIcon type={recent.type} class="h-3 w-3" />
					<span class="sr-only text-xs">{recent.type}</span>
				</div>
				<img
					class="aspect-square w-32 rounded-lg border object-cover shadow"
					src={recent.image ??
						(recent.uri ? `https://icon.horse/icon/${getHostname(recent.uri)}` : '')}
					alt={recent.title}
				/>
				<div class="flex flex-col whitespace-normal">
					<span class="line-clamp-3 font-medium leading-none">{recent.title}</span>
					<Muted class="line-clamp-2">{recent.author}</Muted>
				</div>
			</a>
		{/each}
	</div>
</div>
