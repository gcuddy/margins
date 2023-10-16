<script lang="ts">
	import { LoaderIcon } from 'lucide-svelte';
	import type { ComponentProps } from 'svelte';
	import { toast } from 'svelte-sonner';

	import { page } from '$app/stores';
	import { Button }  from '$components/ui/button';
	import {
		Dialog,
		DialogContent,
		DialogFooter,
		DialogHeader,
		DialogTitle
	} from '$components/ui/dialog';
	import Editor from '$components/ui/editor/Editor.svelte';
	import { mutation } from '$lib/queries/query';
	import { state, update_entry } from '$lib/state/entries';

	export let isOpen = false;
	export let entry: { id: number };

	// Internal Variables
	let editor: Editor;

    $: entry_state = $state[entry.id];

	function save() {
		const contentData = editor.getJSON();
		toast.promise(
			mutation($page, 'save_note', {
				type: 'note',
				contentData,
				entryId: entry.id
			}),
			{
				loading: 'Saving...',
				success: ({id}) => {
                    isOpen = false;
                    // update_entry(entry.id, {
                    //     annotations: [
                    //         ...entry_state.annotations ?? [],
                    //         {
                    //             id,
                    //             contentData,
                    //             username: $page.data.user_data.username ?? '',
                    //             createdAt: new Date().toISOString()
                    //         }
                    //     ]
                    // });
                    return 'Saved!'
                },
				error: 'Failed to save.'
			}
		);
	}
</script>

<Dialog bind:isOpen>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Add note</DialogTitle>
			<!-- <DialogDescription>Copy and paste the URL to add.</DialogDescription> -->
		</DialogHeader>
		<Editor bind:this={editor} blank />
		<DialogFooter>
			<Button variant="secondary" on:click={() => (isOpen = false)}>Cancel</Button>
			<Button on:click={save}>
				<span>Save</span>
			</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
