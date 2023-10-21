<script lang="ts">
	import type { Entry, Interaction } from '@prisma/client';
	import { CheckCircle, MoreHorizontal } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { Validation } from 'sveltekit-superforms/index';

	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import Button, { buttonVariants } from '$lib/components/ui/Button.svelte';
		import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle	} from '$lib/components/ui/card';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger	} from '$lib/components/ui/dropdown-menu';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/Label.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import { mutation } from '$lib/queries/query';
	import type { InteractionSchema } from '$lib/schemas';
	import { formatDate } from '$lib/utils/date';
	import { cn } from '$lib/utils/tailwind';

	export let interaction: Pick<
		Interaction,
		'id' | 'title' | 'started' | 'note' | 'currentPage' | 'finished'
	>;

	export let data: Validation<InteractionSchema>;
	const { form, enhance, submitting, delayed } = superForm(data, {
		// resetForm: true,
		dataType: 'json'
	});

	export let total_pages: number | undefined = undefined;

	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
</script>

<Card class="relative">
	<DropdownMenu>
		<DropdownMenuTrigger
			class={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'absolute right-2 top-2')}
		>
			<MoreHorizontal class="h-4 w-4" />
		</DropdownMenuTrigger>
		<DropdownMenuContent>
			<DropdownMenuItem>Edit</DropdownMenuItem>
			<DropdownMenuItem
				on:click={() => {
					mutation($page, 'deleteInteraction', { id: interaction.id }).then(() =>
						invalidate('entry')
					);
				}}>Delete</DropdownMenuItem
			>
		</DropdownMenuContent>
	</DropdownMenu>
	{#if interaction.title || interaction.note}
		<CardHeader>
			{#if interaction.title}
				<CardTitle>
					<!-- i -->
					{interaction.title}
				</CardTitle>
			{/if}
			{#if interaction.note}
				<CardDescription>
					{interaction.note}
				</CardDescription>
			{/if}
		</CardHeader>
	{/if}
	<CardContent>
		<form action="?/interaction" method="post" class="contents" use:enhance>
			<input type="hidden" name="entryId" value={$form.entryId} />
			<input type="hidden" name="id" value={$form.id} />
			{#if interaction.started}
				<Label>Date Started</Label>
				{formatDate(interaction.started)}
			{/if}
			{#if interaction.finished}
				Date Finished: {formatDate(interaction.finished)}
			{:else if total_pages}
				<!-- Todo: non-relative -->
				<!-- <SuperDebug data={$form} /> -->
				<Label for="currentPage">Current Page</Label>
				<div class="flex items-center gap-x-2">
					<Input type="number" name="currentPage" bind:value={$form.currentPage} />
					<input
						type="hidden"
						name="progress"
						value={$form.currentPage ? $form.currentPage / total_pages : 0}
					/>
					<Button
						on:click={() => {
							if (total_pages) {
								$form.progress = $form.currentPage ? $form.currentPage / total_pages : 0;
							}
						}}
						type="submit"
						variant="ghost"
						size="sm">Update</Button
					>
				</div>
				{$form.currentPage ?? 0} / {total_pages}
				<Progress value={(($form.currentPage ?? 0) / total_pages) * 100} />
				{$form.progress}
			{/if}
		</form>
	</CardContent>
	{#if !interaction.finished}
		<CardFooter class="justify-end">
			<form action="?/interaction" class="contents" method="post" use:enhance>
				<input type="hidden" name="entryId" value={$form.entryId} />
				<input type="hidden" name="id" value={$form.id} />
				<input type="hidden" name="finished" value={new Date().toISOString()} />
				<Button
					on:click={() => {
						$form.finished = new Date();
						$form.progress = 1;
					}}
					disabled={$submitting}
				>
					<CheckCircle class="mr-2 h-4 w-4" />
					Mark as finished</Button
				>
			</form>
		</CardFooter>
	{/if}
</Card>
