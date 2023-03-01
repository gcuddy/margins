<script lang="ts">
	import { modals } from "$lib/stores/modals";
	import { DialogDescription, DialogTitle } from "@rgossiaux/svelte-headlessui";
	import Button from "./Button.svelte";

	export let title = "";
	export let description = "";
	export let content = '';
	export let onConfirm = () => {};
	export let confirmText = "Confirm";
</script>

<div
	class="relative z-50 mx-auto flex flex-col gap-2 rounded-xl bg-gray-50 p-8 text-gray-900 shadow-2xl ring-1 ring-black/5 dark:bg-gray-700 dark:text-gray-100"
>
	{#if title}
		<DialogTitle class="font-semibold">{title}</DialogTitle>
	{/if}
	{#if description}
		<DialogDescription class="text-sm text-muted">{description}</DialogDescription>
	{/if}
	<slot>
		{content}
	</slot>
	<div class="flex justify-end mt-4">
		<div class="flex flex-row-reverse gap-2">
			<Button
				on:click={() => {
					modals.close();
					onConfirm();
				}}
				variant="confirm"
				className="focus:ring focus-visible:ring active:ring">{confirmText}</Button
			>
			<Button
				on:click={() => {
					modals.close();
				}}
				variant="ghost">Cancel</Button
			>
		</div>
	</div>
</div>
