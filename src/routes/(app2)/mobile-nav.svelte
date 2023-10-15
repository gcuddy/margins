<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib';
	import { createDialog, melt } from '@melt-ui/svelte';
	import { Library, Menu, Rss, Pin } from 'lucide-svelte';

	import { writable } from 'svelte/store';
	import { fade, fly } from 'svelte/transition';

	import * as Sheet from '$components/ui/sheet';

	import { nav as mainnav } from './Nav.svelte';
	import { Button } from '$components/ui/button';
	import { tick } from 'svelte';

	const nav = [
		{
			active: (url: string) => url.startsWith('/library'),
			href: '/library/backlog',
			icon: Library,
			label: 'Library',
		},
		{
			active: (url: string) => url.startsWith('/subscriptions'),
			href: '/subscriptions',
			icon: Rss,
			label: 'Subscriptions',
		},
	];

	let open = false;
</script>

<div class="fixed bottom-0 z-40 w-full sm:hidden">
	<div
		class="items-center gap-10 justify-center h-16 py-2 px-6 flex w-full bg-background/95 background-blur-sm border-t"
	>
		{#each nav as item}
			<a href={item.href} class="flex flex-col items-center shrink-0">
				<svelte:component
					this={item.icon}
					class={cn(
						'w-6 h-6',
						item.active($page.url.pathname) && 'text-primary',
					)}
				/>
				<span
					class={cn(
						'text-xs',
						item.active($page.url.pathname) && 'text-primary',
					)}>{item.label}</span
				>
			</a>
		{/each}
		<Sheet.Root bind:open>
			<Sheet.Trigger class="flex flex-col items-center shrink-0">
				<Menu class="w-6 h-6" />
				<span class="text-xs">More…</span>
			</Sheet.Trigger>
			<Sheet.Content side="bottom" class="safe-area h-2/3 rounded-t-xl">
				<div
					class="flex flex-col gap-4"
					on:click={() => {
						// TODO: this sometimes doesn't trigger close animation (just jumps close)
						open = false;
					}}
				>
					<!-- <a href="/settings" class="flex flex-col items-center shrink-0">
                        <span class="text-xs">Settings</span>
                    </a>
                    <a href="/about" class="flex flex-col items-center shrink-0">
                        <span class="text-xs">About</span>
                    </a> -->
					{#each mainnav as nav_item}
						<Button
							href={nav_item.href}
							class="flex w-full items-center justify-start space-x-2 py-4"
							variant={nav_item.active($page.url.pathname)
								? 'secondary'
								: 'ghost'}
						>
							<svelte:component this={nav_item.icon} class="square-6" />
							<span class="">{nav_item.label}</span>
						</Button>
					{/each}
					<Button
						href="/pins"
						class="flex w-full items-center justify-start space-x-2 py-4"
						variant={$page.url.pathname === '/pins' ? 'secondary' : 'ghost'}
					>
						<Pin class="h-6 w-6" />
						<span>Pins</span>
					</Button>
				</div>
			</Sheet.Content>
		</Sheet.Root>
		<!-- <div use:melt={$portalled}>
			{#if $open}
				<div
					use:melt={$overlay}
					class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
					transition:fade={{ duration: 150 }}
				/>
				<div
					use:melt={$content}
					class="menu safe-area fixed bottom-0 z-50 h-2/3 w-full bg-background px-2
				 pt-6 shadow-lg focus:outline-none"
					transition:fly={{ y: 768, duration: 300, opacity: 1 }}
				>
                all the content here
            </div>
			{/if}
		</div> -->
	</div>
</div>

<style lang="postcss">
	.menu,
	.menu :global(*) {
		@apply !ring-0;
	}

	.safe-area {
		padding-bottom: calc(6.5rem + env(safe-area-inset-bottom));
	}
</style>
