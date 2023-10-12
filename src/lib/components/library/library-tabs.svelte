<script lang="ts">
	import type { Status } from '@prisma/client';
	import { fade, fly } from 'svelte/transition';

	import { page } from '$app/stores';
	import { tabList } from '$lib/components/ui/tabs/TabsList.svelte';
	import { tabTrigger } from '$lib/components/ui/tabs/TabsTrigger.svelte';
	import { bg } from '$lib/data/styles';
	import type { EntryInList } from '$lib/db/selects';
	import * as Tabs from '$components/ui/tabs';
	import { receive, send } from '$lib/transitions';
	import { cn } from '$lib/utils';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	const prefix = '/tests';
	const tabs = [
		{ href: '/library/backlog', name: 'Backlog' },
		{ href: '/library/now', name: 'Now' },
		{ href: '/library/archive', name: 'Archive' },
	] as const;

    $: defaultValue = tabs.find((t) => $page.url.pathname.includes(t.href))?.name ?? 'Backlog';
    console.log({defaultValue})

	const archiving_entries: Array<EntryInList> = [];

	const moving_entries: Record<Status, Array<EntryInList>> = {
		Archive: [],
		Backlog: [],
		Now: [],
	};

	export function move_entries(entries: Array<EntryInList>, status: Status) {
		moving_entries[status] = Array.from(
			new Set([...entries, ...moving_entries[status]]),
		);
	}

	let _highlight_archive = false;

	$: pathname = $page.url.pathname;

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

<Tabs.Root
    value={defaultValue}
	onValueChange={(val) => {
        console.log('value change')
		const tab = tabs.find((t) => t.name === val);
		if (tab && browser) {
			goto(prefix + tab.href, {
                keepFocus: true,
                invalidateAll: false,
                noScroll: true
            });
		}
	}}
>
	<Tabs.List>
		{#each tabs as tab}
			<Tabs.Trigger value={tab.name}>{tab.name}</Tabs.Trigger>
		{/each}
	</Tabs.List>
</Tabs.Root>
<!--
<div class={tabList}>
	{#each tabs as { href, name }}
		{@const selected = $page.url.pathname === prefix + href}
		<a
			draggable="false"
			href={prefix + href}
			class={cn(
				tabTrigger({
					class: `relative transition-colors`,
					selected: false,
				}),
				'relative data-[state=active]:text-foreground',
			)}
			data-sveltekit-keepfocus
			data-sveltekit-replacestate
			on:click={() => {
				pathname = prefix + href;
			}}
			class:animate-scale-1={name === 'Archive' && _highlight_archive}
			data-tab={name}
			data-state={selected ? 'active' : undefined}
		>
			{#if selected}
				<div
					out:send={{
						key: 'indicator',
					}}
					in:receive={{
						key: 'indicator',
					}}
					class="absolute inset-0 bg-background shadow rounded-md"
				></div>
			{/if}
			<span class="z-[1]">{name}</span>
			<div
				class="absolute inset-0 -top-4 z-10 flex items-center justify-center -space-x-[.9rem]"
			>
				{#each moving_entries[name] as entry, i (entry.id)}
					<img
						on:introend={() => {
							console.log('running introend');
							moving_entries[name] = moving_entries[name].filter(
								(e) => e.id !== entry.id,
							);
							setTimeout(() => {
								// archiving_entries = archiving_entries.filter((e) => e.id !== entry.id);
							}, 250);
						}}
						in:receive|global={{
							key: `${name.toLowerCase()}-${entry.id}`,
						}}
						out:fly|global={{
							delay: 300,
							duration: 500,
							opacity: 0,
							y: 10,
						}}
						src={entry.image}
						class="h-5 w-5 rounded-full shadow relative border"
						alt=""
					/>
				{/each}
			</div>
		</a>
	{/each}
</div> -->
