<script lang="ts">
	import * as AlertDialog from '$components/ui/alert-dialog';
	import type { createAlertDialogStore } from '$lib/stores/dialog';
	import { Input } from '$components/ui/input';
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
			<Input bind:value={$store.value} />
			<AlertDialog.Footer>
				<AlertDialog.Cancel on:m-click={store.reset}>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action
					type="submit"
					on:m-click={({ detail }) => {
						console.log({ $store });
						$store.action?.($store.value);
					}}>Continue</AlertDialog.Action
				>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
