<script lang="ts">
	import Button from '$components/ui/Button.svelte';
	import { noop } from '$lib/helpers';
	import { toast } from 'svelte-sonner';
</script>

<Button
	on:click={() => {
		toast.success('Scheduled: Catch Up', {
            description: `You're all caught up!`,
			action: {
				label: 'Undo',
                onClick: noop
			}
		});
	}}
>
	Click me
</Button>

<Button
	on:click={() => {
		toast.error('Uh oh!', {
            description: `Something went wrong`,
			action: {
				label: 'Try again',
                onClick: noop
			}
		});
	}}
>
	Error
</Button>
