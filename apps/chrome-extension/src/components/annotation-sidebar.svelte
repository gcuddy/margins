<!-- TODO: make this into a web component to avoid style specificity wars -->
<!-- <svelte:options customElement="margins-sidebar" /> -->

<script lang="ts">
	// import '@margins/ui/styles/style.css';
	import { Button, Logo } from '@margins/ui';
	import { writable } from 'svelte/store';
	import { scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import ShadowDomWrapper from './shadow-dom-wrapper.svelte';
	import QueryProvider from './query-provider.svelte';
	import RpcProvider from './rpc-provider.svelte';
	import EntryProvider from './entry-provider.svelte';
	import AnnotationsSidebarInner from './annotations-sidebar-inner.svelte';
	import AnnotationMenu from './annotation-menu.svelte';
	export let zIndex = 1000;
	export let userID: string;
	export let sessionID: string;

	let el = writable();
	let show = false;
	let mounted = false;

	onMount(() => {
		mounted = true;
	});
</script>

<ShadowDomWrapper>
	<QueryProvider>
		<RpcProvider useBackground {userID} {sessionID}>
			<EntryProvider let:entryID>
				<!-- <AnnotationInlineMenu /> -->
				<AnnotationMenu />
				{#if mounted}
					<div
						transition:scale
						style:z-index={zIndex + 1}
						data-margins-sidebar-button
						class="fixed right-4 top-4"
					>
						<Button
							on:click={() => {
								show = !show;
							}}
							size="icon"
							variant="outline"
							class="h-10 w-10"
						>
							<Logo class="h-8 w-8" />
						</Button>
					</div>

					{#if show}
						<div
							data-margins-sidebar
							style:z-index={zIndex - 1}
							class="entry-inspector bg-background-elevation2 fixed bottom-0 right-0 top-0 w-72 overflow-y-auto border-l px-6 py-3.5 text-sm"
							bind:this={$el}
						>
							<AnnotationsSidebarInner {entryID} />
						</div>
					{/if}
				{/if}
			</EntryProvider>
		</RpcProvider>
	</QueryProvider>
</ShadowDomWrapper>

<style>
	div[data-margins-sidebar-button] :global(button) {
		background-color: black;
	}

	.entry-inspector {
		position: fixed;
		right: 0;
		bottom: 0;
		top: 0;
	}
	div[data-margins-sidebar] {
		position: fixed;
		right: 0;
		top: 0;
		bottom: 0;
		width: 20rem;
	}
</style>
