<script lang="ts">
	import Button from '$components/ui/Button.svelte';
	import { cn } from '$lib/utils/tailwind';
	import { InfoIcon } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let scrollingDown = getContext('scrollingDown') as Writable<boolean>;
	export let open: Writable<boolean>;
    let className = '';
    export { className as class};
</script>

<div
	class={cn(
		'fixed top-0 right-4 h-[--nav-height] flex items-center z-50 transition-transform',
		$scrollingDown && !$open && '-translate-y-full',
        className
	)}
>
	<Button on:click={() => ($open = !$open)} variant="ghost" class="p-0 w-10">
		<InfoIcon class="h-4 w-4" />
	</Button>
	<span class="sr-only">Toggle right sidebar</span>
</div>
