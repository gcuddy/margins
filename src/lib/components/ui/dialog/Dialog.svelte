<script lang="ts">
	import { Dialog } from "@rgossiaux/svelte-headlessui";
	import DialogTrigger from "./DialogTrigger.svelte";
	export let isOpen = false;
</script>

<div>
	<DialogTrigger bind:isOpen>
		<slot name="trigger" />
	</DialogTrigger>
	<Dialog
		class="fixed inset-0 z-50 flex items-start justify-center sm:items-center"
		open={isOpen}
		on:close={() => (isOpen = false)}
	>
		<!-- TODO -->
		<slot />
	</Dialog>
</div>
