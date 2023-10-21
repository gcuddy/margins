<script lang="ts">
	import mq from '$lib/stores/mq';
	import { CommandDialog } from './ui/command2';
	import { PopoverContent } from './ui/popover';

    export let open = false;

    let className: string | null | undefined = undefined
    export { className as class };

	// component that becmoes a dialog on small screens, otherwise is poppercontent
</script>

{#if $mq.sm}
	<PopoverContent class={className}>
		<slot />
	</PopoverContent>
    {:else}
	<CommandDialog forceTop bind:open>
		<slot />
	</CommandDialog>
{/if}
