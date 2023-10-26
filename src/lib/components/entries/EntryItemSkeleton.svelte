<script lang="ts">
	import Skeleton from '../ui/skeleton/skeleton.svelte';
</script>

<div class="flex grow items-center gap-x-4 px-2 py-4">
	<Skeleton class="h-12 w-12" />
	<div class="flex grow flex-col space-y-2">
		<Skeleton class="h-4 w-3/4" />
		<Skeleton class="h-4 w-1/2" />
	</div>
</div>
