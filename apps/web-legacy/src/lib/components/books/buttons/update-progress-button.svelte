<script lang="ts">
	import LogInteractionDialog from '$components/entries/interaction-form/log-interaction-dialog.svelte';
	import { Button } from '$components/ui/button';

	import { BookOpenIcon } from 'lucide-svelte';
	import type { ComponentProps } from 'svelte';

    type $$Props = ComponentProps<LogInteractionDialog>;

    export let form: $$Props["form"];
</script>

<LogInteractionDialog {form} partialProgress {...$$restProps} >
	<svelte:fragment slot="trigger" let:builder>
		<Button
			builders={[builder]}
			size="sm"
			variant="default"
			class="rounded-r-none border-r-0"
		>
			<BookOpenIcon class="mr-2 h-4 w-4" />
			Update Progress
		</Button>
	</svelte:fragment>
</LogInteractionDialog>
