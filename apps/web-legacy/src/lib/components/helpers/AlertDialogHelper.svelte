<script lang="ts">
	import * as AlertDialog from '$components/ui/alert-dialog';
	import { Input } from '$components/ui/input';
	import type { createAlertDialogStore } from '$lib/stores/dialog';

	export let store: ReturnType<typeof createAlertDialogStore>;

	$: console.log({ $store });
</script>

<AlertDialog.Root
	bind:open={$store.open}
	{...$store.options}
	onOpenChange={(val) => {
		if (!val) {
			store.reset();
		}
	}}
>
	<AlertDialog.Content>
		{#if $store.title || $store.description}
			<AlertDialog.Header>
				<AlertDialog.Title>{$store.title}</AlertDialog.Title>
				{#if $store.description}
					<AlertDialog.Description>{$store.description}</AlertDialog.Description
					>
				{/if}
			</AlertDialog.Header>
		{/if}
		{#if $store.component}
			{@const props = typeof $store.props === 'object' ? $store.props : {}}
			<svelte:component this={$store.component} {...props} />
		{:else}
			<form class="contents" on:submit|preventDefault>
				{#if $store.value}
					<Input bind:value={$store.value} />
				{/if}
				<AlertDialog.Footer>
					<AlertDialog.Cancel
						on:click={() => {
							console.log('clicked cancel');
							$store.cancel?.();
						}}>Cancel</AlertDialog.Cancel
					>
					<!-- type="submit" -->
					<AlertDialog.Action
						on:keydown={({ detail }) => {
                            // crazy wrong types here, ignore this
                            //@ts-ignore
                            const event = detail.originalEvent
							console.log('keydown action', event);
							// for some rason we have to do this this way...
							if (event.key === 'Enter') {
								console.log('enter pressed');
								$store.action?.($store.value);
							}
						}}
						on:click={({ detail }) => {
							console.log('clicked action');
							console.log({ $store });
							$store.action?.($store.value);
						}}>Continue</AlertDialog.Action
					>
				</AlertDialog.Footer>
			</form>
		{/if}
	</AlertDialog.Content>
</AlertDialog.Root>
