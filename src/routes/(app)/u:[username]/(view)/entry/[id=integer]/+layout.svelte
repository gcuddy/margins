<script lang="ts">
	import { page } from '$app/stores';
	import type { LayoutData } from '../../../entry/[id=integer]/$types';
	$: console.log({ $page });
	// $: currentList = $page.data.currentList;
	export let data: LayoutData;
	$: currentList = data.currentList;
</script>

<div class="bg-skin-entry-bg pb-9 dark:bg-gray-900">
	<slot />
</div>
