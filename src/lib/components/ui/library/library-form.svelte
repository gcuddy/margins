<script lang="ts">
	import { statuses, type Status, statusesWithIcons } from '$lib/status';
	import type { Type } from '$lib/types';
	import Button, { buttonVariants } from '../Button.svelte';

	import { Popover, PopoverContent, PopoverTrigger } from '$components/ui/popover2';
	import { melt } from '@melt-ui/svelte';
	import Cmd from '../cmd/Cmd.svelte';
	import { writable } from 'svelte/store';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { mutation, type MutationInput } from '$lib/queries/query';
	import type { SaveToLibrarySchema } from '$lib/queries/server';
	import { page } from '$app/stores';

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

	const open = writable(false);

	const queryClient = useQueryClient();

	const saveMutation = createMutation({
		mutationFn: async (input: MutationInput<'save_to_library'>) => {
			console.log(`mutating`, { input });
			return mutation($page, 'save_to_library', input);
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['entries']
			});
			open.set(false);
		}
	});

	function handleAction(status: Status) {
		const opts = {
			type,
			status,
			entryId,
			spotifyId,
			googleBooksId,
			podcastIndexId,
			tmdbId
		} as SaveToLibrarySchema;
		$saveMutation.mutate(opts);
	}

	const items = statuses.map((name) => ({
		name,
        id: name,
		icon: statusesWithIcons[name],
		action: () => {
			status = name;
			handleAction(name);
		}
	}));
</script>

<form>
	<Popover forceVisible={true} bind:open={$open}>
		<PopoverTrigger let:builder asChild>
			<button use:melt={builder} class={buttonVariants({ variant: 'ghost', size: 'sm' })}>
				{#if status}
					<svelte:component this={statusesWithIcons[status]} class="w-4 h-4 mr-2" />
					{status}
				{:else}
					+ Save
				{/if}
			</button>
		</PopoverTrigger>
		<PopoverContent class="w-[200px] p-0">
			<Cmd
                defaultId={status}
				{open}
				items={[
					{
						items
					}
				]}
				closeOnAction={true}
				placeholder="Status"
			/>
		</PopoverContent>
	</Popover>
</form>
