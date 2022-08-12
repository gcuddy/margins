<script lang="ts">
	import Button from '../Button.svelte';

	export let text: string;
	export let confirm: string;
</script>

<div class="flex max-w-sm flex-col space-y-2">
	<div>{@html text}</div>
	<div class="flex justify-end space-x-2">
		<Button variant="ghost">Cancel</Button>
		<Button variant="primary">{confirm}</Button>
	</div>
</div>
