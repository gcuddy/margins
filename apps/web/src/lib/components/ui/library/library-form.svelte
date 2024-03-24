<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { writable } from 'svelte/store';

	import { page } from '$app/stores';
	import * as Command from '$components/ui/command2';
	import {
		Popover,
		PopoverContent,
		PopoverTrigger,
	} from '$components/ui/popover';
    import PopoverDialog from '$components/popover-dialog.svelte';
	import { mutation, type MutationInput } from '$lib/queries/query';
	import type { SaveToLibrarySchema } from '$lib/queries/server';
	import {
		statusesToDisplay,
		statusesWithIcons,
		type Status,
	} from '$lib/status';
	import { Button, type ButtonProps } from '$components/ui/button';

	import { objectEntries } from '$lib/helpers';
	import { invalidateEntries } from '$lib/queries/mutations';
	import { buttonVariants } from '../Button.svelte';
	import Separator from '../Separator.svelte';
	import { ChevronDown, Plus } from 'radix-icons-svelte';
    import { Loader } from "lucide-svelte";
	import { cn } from '$lib';
	import type { ComponentType } from 'svelte';

	/**
	 * Should be entry id, google books id, spotify id, tmdbId, etc...
	 * @REVIEW should we have separate props for each type of id?
	 */

	export let entryId: number | undefined = undefined;
	export let type: SaveToLibrarySchema['type'];
	export let status: SaveToLibrarySchema['status'] = undefined;
	export let spotifyId: string | undefined = undefined;
	export let googleBooksId: string | undefined = undefined;
	export let podcastIndexId: number | undefined = undefined;
	export let tmdbId: number | undefined = undefined;
	export let historyId: string | undefined = undefined;
	export let size: ButtonProps['size'] = 'default';
	export let variant: ButtonProps['variant'] = 'ghost';
	export let icon: ComponentType | undefined = undefined;

	export let unsavedStyle: 'popover' | 'arrow' = 'popover';

	export let bodyPortal = false;

	const open = writable(false);

	const queryClient = useQueryClient();

	const saveMutation = createMutation({
		mutationFn: async (input: MutationInput<'save_to_library'>) => {
			console.log(`mutating`, { input });
			return mutation($page, 'save_to_library', input);
		},
		onSuccess: () => {
			invalidateEntries(queryClient);
		},
		onSettled: () => {
			// queryClient.invalidateQueries({
			// 	queryKey: ['entries'],
			// });
			open.set(false);
		},
	});


	function handleAction(status: Status) {
		const opts = {
			entryId,
			googleBooksId,
			historyId,
			podcastIndexId,
			seen: 1,
			spotifyId,
			status,
			tmdbId,
			type,
		} as SaveToLibrarySchema;
		$saveMutation.mutate(opts);
	}
	let wrapper: HTMLElement;
</script>

<div bind:this={wrapper} class="flex">
	{#if !status && unsavedStyle === 'arrow'}
		<!-- Button, popover becomes arrow -->
		<Button
			class="rounded-r-none border-r-0"
			{variant}
			on:click={() => {
				handleAction('Backlog');
			}}
		>
			<svelte:component
				this={$saveMutation.isPending ? Loader : icon ? icon : Plus}
				class="h-4 w-4 text-muted-foreground stroke-[1.5] mr-2 {$saveMutation.isPending ? 'animate-spin' : ''}"
			/> Save
		</Button>
		<Separator orientation="vertical" class="h-9" />
	{/if}
	<Popover
		portal={bodyPortal ? 'body' : wrapper}
		bind:open={$open}
		positioning={{
			overlap: true,
			strategy: 'fixed',
			placement: 'bottom-start',
		}}
	>
		<PopoverTrigger let:builder asChild>
			<Button
				class={cn(
					!status && unsavedStyle === 'arrow' && 'rounded-l-none border-l-0',
				)}
				builders={[builder]}
				size={!status && unsavedStyle === 'arrow' ? 'icon' : size}
				{variant}
			>
				{#if status}
					<svelte:component
						this={statusesWithIcons[status]}
						class="w-4 h-4 mr-2 stroke-[1.5]"
					/>
					{statusesToDisplay[status]}
				{:else if unsavedStyle === 'popover'}
					<svelte:component
						this={icon ? icon : Plus}
						class="h-4 w-4 stroke-[1.5] mr-2 text-muted-foreground"
					/> Save
				{:else}
					<ChevronDown class="w-4 h-4" />
				{/if}
			</Button>
		</PopoverTrigger>
		<PopoverDialog bind:open={$open} class="w-[200px] p-0">
			<Command.Root onClose={() => open.set(false)} bind:value={status}>
			<Command.Input autofocus placeholder="Status…"></Command.Input>
				<Command.Group>
					<Command.List>
						{#each objectEntries(statusesToDisplay) as [value, label]}
							<Command.RadioItem
								{value}
								onSelect={() => {
									handleAction(value);
								}}
							>
								<Command.Icon
									class="stroke-[1.5]"
									icon={statusesWithIcons[value]}
								/>
								{label}
							</Command.RadioItem>
						{/each}
					</Command.List>
				</Command.Group>
			</Command.Root>
		</PopoverDialog>
	</Popover>
</div>
