<script lang="ts">
	import Textarea from '$components/ui/Textarea.svelte';
	import Input from '$components/ui/Input.svelte';
	import Button from '$components/ui/Button.svelte';
	import {
		Dialog,
		DialogTrigger,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogFooter
	} from '$components/ui/dialog';
	import SrsCard from '$components/ui/srs-card/SRSCard.svelte';
	import MarkdownBox from '$components/MarkdownBox.svelte';
	import Label from '$components/ui/Label.svelte';
	import { enhance } from '$app/forms';
	import { formatDate } from '$lib/utils/date';
	import PromptInput from '$components/ui/srs-card/PromptInput.svelte';
	import { PlusCircle } from 'lucide-svelte';
	import { getCommanderContext } from '$lib/commands/GenericCommander.svelte';
	import JumpToEntry from '$lib/commands/JumpToEntry.svelte';

	export let data;

	let pending = false;

	$: console.log({ data });

	let promptInput: PromptInput;

    const commander_store = getCommanderContext();
</script>

<Button as="a" href="/tests/srs/review">Start Review Session</Button>

<Dialog>
	<!-- TODO: allow tags etc (also possibly make body/response accept contentdata with tiptap... but maybe this is idiotic.)
Allow linking to sources (either other parent annotations or entries itself)
-->
	<svelte:fragment slot="trigger">
		<Button>New Card</Button>
	</svelte:fragment>

	<DialogContent let:close>
		<DialogHeader>
			<DialogTitle>New Card</DialogTitle>
		</DialogHeader>
		<PromptInput showButton={false} bind:this={promptInput} />
		<DialogFooter>
            <Button on:click={() => {
                commander_store.open({
                    component: JumpToEntry
                })
            }} class="mr-auto -ml-1" variant="ghost">
                <PlusCircle class="h-4 w-4 mr-2" />
                Link with entry
            </Button>
			<Button disabled={pending} type="submit">Save</Button>
		</DialogFooter>
		<!-- <form
			class="contents"
			method="post"
			action="?/new"
			use:enhance={() => {
				pending = true;
				return async ({ update }) => {
					await update();
					pending = false;
					close();
				};
			}}
		>
			<DialogHeader>
				<DialogTitle>New Card</DialogTitle>
			</DialogHeader>
			<Label for="prompt">Prompt</Label>
			<MarkdownBox id="prompt" name="body" placeholder="Enter prompt here" />
			<Label for="response">Response</Label>
			<MarkdownBox
				id="response"
				name="response"
				placeholder="Enter response here"
				as="textarea"
				rows={1}
			/>
			<DialogFooter>
				<Button disabled={pending} type="submit">Save</Button>
			</DialogFooter>
		</form> -->
	</DialogContent>
</Dialog>

<table>
	{#each data.srs_notes as note}
		<tr>
			<td>
				<a href="/tests/srs/{note.id}">{note.body}</a>
			</td>
			<td>
				{#if note.due_timestamp}
					{formatDate(note.due_timestamp)}
				{/if}
			</td>
		</tr>
	{/each}
</table>
