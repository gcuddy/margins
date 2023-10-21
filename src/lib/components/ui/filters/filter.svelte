<script lang="ts">
	import * as AlertDialog from '$components/ui/alert-dialog';
	import { checkIfKeyboardShortcutsAllowed } from '$lib/stores/keyboard';
	import { Input } from '../input';
	import { ctx } from './ctx';

	// TODO: allow passing in stores (BYOS)
	// for now: can pass in whole ctx if you want
	export let context = ctx.set();
	const {
		state: { dialogStore, hasFilters, filterStore, open },
	} = context;

	export let allowKeyboardShortcut = true;
</script>

<slot hasFilters={$hasFilters} reset={filterStore.reset} />

<svelte:window
	on:keydown={(event) => {
		if (!allowKeyboardShortcut) return;
		if (!checkIfKeyboardShortcutsAllowed()) return;
		if (event.key === 'f') {
			$open = true;
		}
	}}
/>

<AlertDialog.Root bind:open={$dialogStore.open}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{$dialogStore.title}</AlertDialog.Title>
		</AlertDialog.Header>
		<form
			class="contents"
			on:submit|preventDefault={(e) => {
				console.log('submit', { e });
			}}
		>
			<Input bind:value={$dialogStore.value} />
			<AlertDialog.Footer>
				<AlertDialog.Cancel
					on:click={() => {
						console.log('cancel llsld');
					}}>Cancel</AlertDialog.Cancel
				>
				<AlertDialog.Action
					type="submit"
					on:click={() => {
						dialogStore.action();
					}}>Continue</AlertDialog.Action
				>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
