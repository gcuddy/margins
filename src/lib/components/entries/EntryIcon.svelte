<script lang="ts">
	import type { Entry } from '@prisma/client';
	import { entryTypeIcon } from './icons';
	export let type: Entry['type'];
	let className = '';
	export { className as class };
</script>

<svelte:component this={entryTypeIcon[type]} class={className} />
