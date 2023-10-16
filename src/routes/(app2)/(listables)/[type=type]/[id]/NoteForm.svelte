<script lang="ts">
	import { LoaderIcon } from 'lucide-svelte';
	import type { ComponentProps } from 'svelte';

    import AnnotationForm from '$components/AnnotationForm.svelte';
	import { Button }  from '$components/ui/button';
    import {
		Dialog,
		DialogContent,
		DialogFooter,
		DialogHeader,
		DialogTitle
	} from '$components/ui/dialog';
	import { state, update_entry } from '$lib/state/entries';

    export let isOpen = false;

    export let entry: { id: number };

	export let data: ComponentProps<AnnotationForm>['data'];


</script>

<Dialog bind:isOpen>
	<DialogContent>
		<AnnotationForm
			opts={{
				onResult: ({ cancel, result }) => {
					console.log({ result });
					isOpen = false;
					if (result.type === 'success') {
						if (result.data?.form?.data) {
							update_entry(entry.id, {
								annotations: [...($state[entry.id].annotations ?? []), result.data.form.data]
							});
						}
					}
					cancel();
				}
			}}
			{data}
			{entry}
			class="contents"
		>
			<svelte:fragment slot="header">
				<DialogHeader>
					<DialogTitle>Add note</DialogTitle>
					<!-- <DialogDescription>Copy and paste the URL to add.</DialogDescription> -->
				</DialogHeader>
			</svelte:fragment>
			<svelte:fragment slot="footer" let:delayed>
				<DialogFooter>
					<Button>
						<span>Save</span>
						{#if delayed}
							<LoaderIcon class="animate-spin" />
						{/if}
					</Button>
				</DialogFooter>
			</svelte:fragment>
		</AnnotationForm>
	</DialogContent>
</Dialog>
