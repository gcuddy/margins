<script lang="ts">
	import * as AlertDialog from '$components/ui/alert-dialog';
	import { Input } from '$components/ui/input';
	import type { createAlertDialogStore } from '$lib/stores/dialog';

	export let store: ReturnType<typeof createAlertDialogStore>;

	$: console.log({ $store });
</script>

<AlertDialog.Root bind:open={$store.open}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{$store.title}</AlertDialog.Title>
			{#if $store.description}
				<AlertDialog.Description>{$store.description}</AlertDialog.Description>
			{/if}
		</AlertDialog.Header>
		<form class="contents" on:submit|preventDefault>
			{#if $store.value}
				<Input bind:value={$store.value} />
			{/if}
			<AlertDialog.Footer>
				<AlertDialog.Cancel on:click={() => {
                    $store.cancel?.();
                }}>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action
					type="submit"
					on:click={({ detail }) => {
						console.log({ $store });
						$store.action?.($store.value);
					}}>Continue</AlertDialog.Action
				>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
