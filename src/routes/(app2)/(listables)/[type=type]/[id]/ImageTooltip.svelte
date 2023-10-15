<script lang="ts">
	import { MoreHorizontal } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import type { ContentAction } from 'svelte-popperjs';

	import { Button } from '$lib/components/ui/button';

	export let popperContent: ContentAction<any>;
</script>

<!-- position a menu absolutely in bottom-right of img -->

<div transition:fade|global use:popperContent>
	<Button class="absolute bottom-0 right-0">
		<MoreHorizontal />
	</Button>
</div>
