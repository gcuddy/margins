<script>
	import { Loader2Icon } from 'lucide-svelte';
	import { onMount } from 'svelte';
	let p = 0;
	let visible = false;
	onMount(() => {
		visible = true;
		function next() {
			p += 0.1;
			const remaining = 1 - p;
			if (remaining > 0.15) setTimeout(next, 100 / remaining);
		}
		setTimeout(next, 250);
	});
</script>

{#if visible}
	<div role="status" class="animate-in fade-in">
		<Loader2Icon class="h-5 w-5 animate-spin" />
	</div>
{/if}
