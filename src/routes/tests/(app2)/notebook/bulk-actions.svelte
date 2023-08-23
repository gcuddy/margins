<script lang="ts">
	import { getContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import Button from '$components/ui/Button.svelte';
	import { fly } from 'svelte/transition';

	const navWidth = (getContext('mainNavWidth') as Writable<number>) ?? writable(0);

	export let length = 0;
</script>

{#if length}
	<div
		style:left="{$navWidth}px"
		class="fixed bottom-5 right-0 pointer-events-none z-10 flex justify-center"
	>
		<!--  -->
		<div
			in:fly|global={{ y: 20, duration: 300 }}
			class="bg-popover text-popover-foreground border p-4 shadow-md rounded-sm pointer-events-auto gap-4 flex justify-center items-center"
		>
			<span>
				<span>{length}</span> selected
			</span>

			<div class="flex gap-4">
				<slot>
					<Button variant="secondary" class="border border-border">Do something…</Button>
				</slot>
			</div>
		</div>
	</div>
{/if}
