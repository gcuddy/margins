<script lang="ts">
	import LogInteractionDialog from '$components/entries/interaction-form/log-interaction-dialog.svelte';
	import type { InteractionLogInputSchema } from '$components/entries/interaction-form/schema';
	import { Button } from '$components/ui/button';

	import { BookOpenIcon } from 'lucide-svelte';
	import type { ComponentProps } from 'svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

    type $$Props = ComponentProps<LogInteractionDialog>;




    export let form: SuperValidated<InteractionLogInputSchema>;

    const { form: frm } = superForm(form);
</script>

<form>
    <Button
			size="sm"
			variant="secondary"
			class="rounded-r-none border-r-0"
		>
			<BookOpenIcon class="mr-2 h-4 w-4" />
			Update Progress
		</Button>
</form>

<LogInteractionDialog {form} partialProgress {...$$restProps} >
	<svelte:fragment slot="trigger" let:builder>
		<Button
			builders={[builder]}
			size="sm"
			variant="secondary"
			class="rounded-r-none border-r-0"
		>
			<BookOpenIcon class="mr-2 h-4 w-4" />
			Update Progress
		</Button>
	</svelte:fragment>
</LogInteractionDialog>
