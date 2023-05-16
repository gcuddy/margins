<script lang="ts">
	import { page } from '$app/stores';
	import Collections from '$lib/commands/Collections.svelte';
	import { getCommanderContext } from '$lib/commands/GenericCommander.svelte';
	import { buttonVariants } from '$lib/components/ui/Button.svelte';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuGroup,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import { mutation } from '$lib/queries/query';
	import type { Annotation } from '@prisma/client';
	import { Edit, ListPlus, MoreHorizontal, PackagePlus, TrashIcon } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	// export let data: ComponentProps<AnnotationForm>["data"];
	// export let entry: Pick<Entry, "id">;

	export let annotation: Pick<Annotation, 'id'>;

	let show_note_form = false;

	let className = buttonVariants({ variant: 'ghost', size: 'sm' });
	export { className as class };

	const dispatch = createEventDispatcher();

	const commander = getCommanderContext();
</script>

<DropdownMenu>
	<DropdownMenuTrigger class={className}>
		<slot>
			<MoreHorizontal class="h-4 w-4" /></slot
		>
	</DropdownMenuTrigger>
	<DropdownMenuContent class="w-56">
		<DropdownMenuGroup>
			<DropdownMenuItem on:click={() => dispatch('edit')}>
				<Edit class="mr-2 h-4 w-4" />
				<span>Edit</span></DropdownMenuItem
			>
		</DropdownMenuGroup>
		<DropdownMenuGroup>
			<DropdownMenuItem
			on:click={() =>
					commander.open({
						component: Collections,
						props: {
							onSelect: (collection) => {
								mutation($page, 'addToCollection', {
									collectionId: collection.id,
									annotationId: [annotation.id]
								});
							}
						}
					})}
			>
			<PackagePlus class="mr-2 h-4 w-4" />
			<span>Add to Collection</span></DropdownMenuItem
			>
		</DropdownMenuGroup>
		<DropdownMenuGroup>
			<DropdownMenuItem on:click={() => dispatch('delete')}>
				<TrashIcon class="mr-2 h-4 w-4" />
				<span>Delete</span></DropdownMenuItem
			>
		</DropdownMenuGroup>
		<!-- <DropdownMenuItem>Billing</DropdownMenuItem>
		<DropdownMenuItem>Team</DropdownMenuItem>
		<DropdownMenuItem>Subscription</DropdownMenuItem> -->
	</DropdownMenuContent>
</DropdownMenu>
