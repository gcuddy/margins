<script lang="ts">
	import { createPopover } from '@melt-ui/svelte';

	const {
		elements: { trigger, content, close },
		states: { open }
	} = createPopover();
</script>
