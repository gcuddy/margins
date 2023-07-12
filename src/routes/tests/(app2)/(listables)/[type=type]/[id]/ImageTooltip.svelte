<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { MoreHorizontal } from 'lucide-svelte';
	import type { ContentAction } from 'svelte-popperjs';
	import { fade } from 'svelte/transition';

	export let popperContent: ContentAction<any>;
</script>

<!-- position a menu absolutely in bottom-right of img -->

<div transition:fade|global use:popperContent>
	<Button class="absolute bottom-0 right-0">
		<MoreHorizontal />
	</Button>
</div>
