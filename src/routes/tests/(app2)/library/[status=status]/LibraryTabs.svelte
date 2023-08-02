<script lang="ts">
	import { page } from '$app/stores';
	import { tabList } from '$lib/components/ui/tabs/TabsList.svelte';
	import { tabTrigger } from '$lib/components/ui/tabs/TabsTrigger.svelte';
	import { bg } from '$lib/data/styles';
	import type { EntryInList } from '$lib/db/selects';
	import { receive, send } from '$lib/transitions';
	import type { Status } from '@prisma/client';
	import { fade, fly } from 'svelte/transition';

	const prefix = '/tests';
	const tabs = [
		{ name: 'Backlog', href: '/library/backlog' },
		{ name: 'Now', href: '/library/now' },
		{ name: 'Archive', href: '/library/archive' }
	] as const;

	let archiving_entries: EntryInList[] = [];


	let moving_entries: Record<Status, EntryInList[]> = {
		Backlog: [],
		Now: [],
		Archive: []
	};

	export function move_entries(entries: EntryInList[], status: Status) {
		moving_entries[status] = Array.from(new Set([...entries, ...moving_entries[status]]));
	}

	let _highlight_archive = false;

	function highlight_archive() {
		const archive = document.querySelector('[data-tab="Archive"]');
		console.log({ archive });
		if (archive) {
			_highlight_archive = true;
			setTimeout(() => {
				_highlight_archive = false;
			}, 1000);
		}
	}
</script>

<!-- <Tabs>
	<TabsList>
		{#each tabs as tab}
			<TabsTrigger
				as="a"
				href={prefix + tab.href}
				on:click={(e) => {
					e.preventDefault();
					console.log(e);
				}}>{tab.name}</TabsTrigger
			>
		{/each}
	</TabsList>
</Tabs> -->

<div class={tabList}>
	<!--  -->
	{#each tabs as { name, href }}
		{@const selected = $page.url.pathname === prefix + href}
		<a
			draggable="false"
			href={prefix + href}
			class={tabTrigger({
				selected,
				class: `relative transition-colors`
			})}
			class:animate-scale-1={name === 'Archive' && _highlight_archive}
			data-tab={name}
		>
			{name}
			<div class="absolute inset-0 -top-4 z-10 flex items-center justify-center -space-x-[.9rem]">
				{#each moving_entries[name] as entry, i (entry.id)}
					<!-- on:introend={highlight_archive} -->
					<img
						on:introend={() => {
							console.log("running introend")
							moving_entries[name] = moving_entries[name].filter((e) => e.id !== entry.id);
							setTimeout(() => {
								// archiving_entries = archiving_entries.filter((e) => e.id !== entry.id);
							}, 250);
						}}
						in:receive|global={{
							key: `${name.toLowerCase()}-${entry.id}`
						}}
						out:fly|global={{
							y: 10,
							opacity: 0,
							delay: 300,
							duration: 500
						}}
						src={entry.image}
						class="h-5 w-5 rounded-full shadow relative border"
						alt=""
					/>
				{/each}
			</div>
		</a>
	{/each}
</div>
