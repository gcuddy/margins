<script lang="ts">
	import Button from '$components/ui/Button.svelte';
	import { cn } from '$lib/utils/tailwind';
	import { InfoIcon } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { derived, writable, type Writable } from 'svelte/store';

	export let scrollingDown = (getContext('scrollingDown') as Writable<boolean>) || writable(false);

	$: hide = $scrollingDown;

	$: console.log({ $scrollingDown });

	const rightSidebar = getContext('rightSidebar') as Writable<boolean>;
    const jumping = getContext('jumping') as Writable<boolean>;

    const shouldHide = derived([scrollingDown, jumping], ([$scrollingDown, $jumping]) => {
        return $scrollingDown && !$jumping;
    })

	// TODO: await tick after navigating before listening to scrollingDown
</script>

<!--  -->
<!-- TODO: Hidden Header for showing on hover -->
<div
	class={cn(
		'fixed flex items-center justify-between z-50 left-0 top-0 h-[--nav-height] border-b bg-background transition-transform duration-200 ease-in-out transform',
		$scrollingDown && '-translate-y-full',
		$rightSidebar ? 'w-[calc(100%-var(--right-sidebar-width))]' : 'w-full'
	)}
>
	<div class="flex items-start justify-start w-full relative px-4">
		<div class="left">
			<!--  -->
		</div>
		<div class="center flex-1">
			<!--  -->
		</div>
		<div class="right" />
	</div>
</div>
<!-- Floating Sidebar button (can't put in right because want it to show ) -->
<div
	class={cn(
		'fixed top-0 right-4 h-[--nav-height] flex items-center z-50 transition-transform',
		$scrollingDown && !$rightSidebar && '-translate-y-full'
	)}
>
	<Button
		on:click={() => ($rightSidebar = !$rightSidebar)}
		variant="outline"
		class="w-10 rounded-full p-0"
	>
		<InfoIcon class="h-4 w-4" />
	</Button>
	<span class="sr-only">Toggle right sidebar</span>
</div>
