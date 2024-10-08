<script lang="ts">
	import { Pane, type PaneAPI } from 'paneforge';
	import ResizablePaneGroup from '$lib/ui/resizable-pane-group.svelte';
	import type { Snippet } from 'svelte';
	import ResizableHandle from '$lib/ui/resizable-handle.svelte';
	import PanelLeft from 'lucide-svelte/icons/panel-left';
	import IconButton from '$lib/ui/icon-button.svelte';
	import { fly } from 'svelte/transition';

	let { children }: { children: Snippet } = $props();
	let paneOne = $state() as PaneAPI;
	let sidebarCollapsed = $state(false);
</script>

<ResizablePaneGroup direction="horizontal">
	<Pane
		defaultSize={20}
		minSize={15}
		maxSize={30}
		collapsedSize={0}
		collapsible
		bind:pane={paneOne}
		onCollapse={() => (sidebarCollapsed = true)}
		onExpand={() => (sidebarCollapsed = false)}
	>
		<nav>nav</nav>
	</Pane>
	{#if sidebarCollapsed}
		<div class="h-full w-2"></div>
	{/if}
	<ResizableHandle class="translate-x-px w-0.5 my-2 bg-transparent" />
	<Pane defaultSize={80} class="flex flex-col min-w-0">
		<main
			class="my-2 mr-2 flex flex-col flex-auto overflow-auto items-stretch rounded-2 relative border"
		>
			{#if sidebarCollapsed}
				<div in:fly={{ x: -16, duration: 300, delay: 100 }} class="absolute bottom-4 left-4 z-10">
					<IconButton
						variant="ghost"
						color="gray"
						onclick={() => {
							paneOne.resize(20);
							paneOne.expand();
						}}
					>
						<PanelLeft />
					</IconButton>
				</div>
			{/if}
			{@render children()}
		</main>
	</Pane>
</ResizablePaneGroup>
