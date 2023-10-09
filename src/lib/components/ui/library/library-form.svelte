<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { writable } from 'svelte/store';

	import { page } from '$app/stores';
    import * as Command from "$components/ui/command2"
	import { Popover, PopoverContent, PopoverTrigger } from '$components/ui/popover';
	import { mutation, type MutationInput } from '$lib/queries/query';
	import type { SaveToLibrarySchema } from '$lib/queries/server';
	import { type Status, statuses, statusesWithIcons } from '$lib/status';
	import type { Type } from '$lib/types';

	import Button, { buttonVariants } from '../Button.svelte';
	import Cmd from '../cmd/Cmd.svelte';

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
			entryId,
			googleBooksId,
            historyId,
			podcastIndexId,
            seen: 1,
			spotifyId,
			status,
			tmdbId,
			type
		} as SaveToLibrarySchema;
		$saveMutation.mutate(opts);
	}

</script>

<form>
	<Popover forceVisible={true} bind:open={$open}>
		<PopoverTrigger let:builder asChild>
			<button use:melt={builder} class={buttonVariants({ size: 'sm', variant: 'ghost' })}>
				{#if status}
					<svelte:component this={statusesWithIcons[status]} class="w-4 h-4 mr-2" />
					{status}
				{:else}
					+ Save
				{/if}
			</button>
		</PopoverTrigger>
		<PopoverContent class="w-[200px] p-0">
            <Command.Root onClose={() => open.set(false)} bind:value={status}>
                <Command.Input autofocus placeholder="Status…"></Command.Input>
                <Command.Group>
                    <Command.List>
                        {#each statuses as status}
                            <Command.RadioItem value={status} onSelect={() => {
                                handleAction(status);
                            }}>
                                <Command.Icon icon={statusesWithIcons[status]} />
                                {status}
                            </Command.RadioItem>
                        {/each}
                    </Command.List>
                </Command.Group>
            </Command.Root>
		</PopoverContent>
	</Popover>
</form>
