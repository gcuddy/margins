<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import Collections from '$lib/commands/Collections.svelte';
	import { getCommanderContext } from '$lib/commands/GenericCommander.svelte';
	import JumpToEntry from '$lib/commands/JumpToEntry.svelte';
	import AnnotationForm from '$lib/components/AnnotationForm.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/Button.svelte';
	import {
		Dialog,
		DialogContent,
		DialogFooter,
		DialogHeader,
		DialogTitle
	} from '$lib/components/ui/dialog';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuGroup,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import { mutation } from '$lib/queries/query';
	import { state, update_entry } from '$lib/state/entries';
	import type { Entry } from '@prisma/client';
	import {
		ArrowLeftRight,
		BookOpen,
		Clock,
		Edit,
		ListPlus,
		LoaderIcon,
		MoreHorizontal
	} from 'lucide-svelte';
	import type { ComponentProps } from 'svelte';
	import toast from 'svelte-french-toast';

	export let data: ComponentProps<AnnotationForm>['data'];
	export let entry: Pick<Entry, 'id' | 'type'>;

	let show_note_form = false;
	let show_reading_session = false;

	const commander_store = getCommanderContext();

	function handleCollectionSelect(collection: { id: number }) {
		commander_store.close();
		mutation($page, 'addToCollection', {
			entryId: entry.id,
			collectionId: collection.id
		}).then(() => {
			toast.success('Added to collection');
			invalidate('entry');
		});
	}
</script>

<DropdownMenu>
	<DropdownMenuTrigger class={buttonVariants({ variant: 'secondary' })}>
		<MoreHorizontal />
	</DropdownMenuTrigger>
	<DropdownMenuContent class="w-56">
		<DropdownMenuGroup>
			<DropdownMenuItem
				on:click={() => {
					show_note_form = true;
				}}
			>
				<Edit class="mr-2 h-4 w-4" />
				<span>Make a note</span></DropdownMenuItem
			>
			<DropdownMenuItem>
				<Clock class="mr-2 h-4 w-4" />
				<span>Snooze</span></DropdownMenuItem
			>
			{#if entry.type === 'book'}
				<DropdownMenuItem on:click={() => (show_reading_session = true)}>
					<BookOpen class="mr-2 h-4 w-4" />
					<span>Start reading session</span></DropdownMenuItem
				>
			{/if}
		</DropdownMenuGroup>
		<DropdownMenuGroup>
			<DropdownMenuItem
				on:click={() => {
					commander_store.open({
						component: JumpToEntry,
						placeholder: 'Add relation to...',
						shouldFilter: false,
						props: {
							onSelect(chosen_entry) {
								console.log({ entry });
								commander_store.close();
								mutation($page, 'addRelation', {
									entryId: entry.id,
									relatedEntryId: chosen_entry.id
								}).then(() => {
									toast.success('Added to collection');
									invalidate('entry');
								});
							}
						}
					});
				}}
			>
				<ArrowLeftRight class="mr-2 h-4 w-4" />
				<span>Add Relation</span></DropdownMenuItem
			>
			<DropdownMenuItem
				on:click={() => {
					commander_store.open({
						component: Collections,
						placeholder: 'Add to collection...',
						props: {
							onSelect: handleCollectionSelect
						}
					});
				}}
			>
				<ListPlus class="mr-2 h-4 w-4" />
				<span>Add to Collection</span></DropdownMenuItem
			>
		</DropdownMenuGroup>
		<!-- <DropdownMenuItem>Billing</DropdownMenuItem>
		<DropdownMenuItem>Team</DropdownMenuItem>
		<DropdownMenuItem>Subscription</DropdownMenuItem> -->
	</DropdownMenuContent>
</DropdownMenu>

<Dialog bind:isOpen={show_note_form}>
	<DialogContent>
		<AnnotationForm
			opts={{
				onResult: ({ cancel, result }) => {
					console.log({ result });
					show_note_form = false;
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
