<script lang="ts">
	import { Button } from '$components/ui/button';
	import * as Dialog from '$lib/components/ui/alert-dialog';
	import type { ComponentProps, ComponentType } from 'svelte';
	import LogInteractionForm from './log-interaction-form.svelte';
	import { CalendarPlusIcon } from 'lucide-svelte';

	type $$Props = ComponentProps<LogInteractionForm> & {
		open?: boolean;
        icon?: ComponentType | undefined | null;
	};

	export let open = false;
	export let entry: $$Props['entry'] = undefined;
	export let form: $$Props['form'];
	export let showTrigger = true;

    export let icon: $$Props["icon"] = CalendarPlusIcon;
</script>

<!-- TODO: allow close on escape if not tainted -->
<Dialog.Root bind:open closeOnEscape={false}>
	{#if showTrigger || $$slots.trigger}
		<Dialog.Trigger asChild let:builder>
			<slot name="trigger" {builder}>
				<Button builders={[builder]} variant="outline">
                    <svelte:component this={icon} class="w-4 h-4 mr-2 stroke-[1.5]" />
                    Log</Button>
			</slot>
		</Dialog.Trigger>
	{/if}
	<Dialog.Content>
		<Dialog.Title>Log {entry ? entry.type : ""}</Dialog.Title>
		<LogInteractionForm
			{entry}
			{form}
            {...$$restProps}
			on:updated={() => {
				open = false;
			}}
		>
			<svelte:fragment slot="footer" let:tainted>
				<Dialog.Cancel
					on:click={(e) => {
						if (tainted) {
							if (
								// could maybe do another alert dialog here instead, but this is fine for now
								!confirm(
									`Are you sure you want to cancel? You have unsaved changes.`,
								)
							) {
								e.preventDefault();
							}
						}
					}}
				>
					Cancel
				</Dialog.Cancel>
			</svelte:fragment>
		</LogInteractionForm>
	</Dialog.Content>
</Dialog.Root>
