<script lang="ts">
	import { fade } from 'svelte/transition';
	export let className = '';
</script>

<!-- TODO: a11y -->

<div role="menubar" class={className} out:fade|global={{ duration: 200 }}>
	<!-- maybe extract this menubar component out -->
	<slot />
</div>
