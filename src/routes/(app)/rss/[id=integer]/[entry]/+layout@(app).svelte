<script lang="ts">
	import Button from '$lib/components/Button.svelte';

	import Form from '$lib/components/Form.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';

	import Header from '$lib/components/layout/Header.svelte';
	import { notifications } from '$lib/stores/notifications';
	import { fly } from 'svelte/transition';
	import type { LayoutData } from '../../../../../../.svelte-kit/types/src/routes/(app)/rss/[id=integer]/[entry]./../../../../../.svelte-kit/types/src/routes/(app)/rss/[id=integer]/[entry]/$types';

	let pending_add_item = false;
	export let data: LayoutData;
</script>

<!-- TODO: depending on direction (up or down fly in or out) -->
<div class="h-full">
	<slot />
</div>
<!-- {#key data.url}
	<div in:fly={{ delay: 100, duration: 200, y: -10 }} out:fly={{ duration: 100, y: 10 }}>
		<slot />
	</div>
{/key} -->
