<script>
	import { page } from '$app/stores';
	import AddForm from './AddForm.svelte';
	export let isOpen;
	$: console.log({ isOpen });
</script>

<div class="rounded-lg py-4 px-2 font-normal">
	<AddForm location={$page.data.location || 'INBOX'} modalControls={true} />
</div>
