<script lang="ts" context="module">
	export function createCommanderStore() {
		const store = writable<{
			open: boolean;
			shouldFilter: boolean;
			placeholder: string;
			component: ComponentType | null;
			onSelect?: (item: any) => void;
			props?: Record<string, any>;
			items?: Array<any> | Array<Array<any>>;
			/** only relevant if items passed in, renders html string */
			render?: (item: any) => string;
		}>({
			open: false,
			shouldFilter: false,
			placeholder: '',
			component: null,
			onSelect: undefined
		});

		function open<Component extends SvelteComponent>({
			placeholder = '',
			component,
			props,
			shouldFilter = false
		}: {
			placeholder?: string;
			shouldFilter?: boolean;
			component: ComponentType<Component>;
			props?: ComponentProps<Component>;
		}) {
			store.set({
				open: true,
				placeholder,
				shouldFilter,
				component,
				props
			});
		}

		function close() {
			store.set({
				open: false,
				placeholder: '',
				component: null,
				props: undefined,
				shouldFilter: false
			});
		}

		// Specific features

		function addToCollection(entry_id: number) {
			let $page: Page;
			const unsubscribe = page_store.subscribe((page) => ($page = page));
			open({
				component: Collections,
				placeholder: 'Add to collection...',
				props: {
					onSelect: (c) => {
						update_entry(entry_id, (data) => {
							return {
								collections: [
									...(data.collections ?? []),
									{
										id: c.id,
										name: c.name
									}
								]
							};
						});
						close();
						toast.promise(
							mutation($page, 'addToCollection', {
								entryId: $page.data.entry?.id,
								collectionId: c.id
							}).finally(() => {
								invalidate('entry');
							}),
							{
								loading: 'Adding to collection...',
								success: 'Added to collection',
								error: 'Failed to add to collection'
							}
						);
					},
					onFallback: (name) => {
						close();
						toast.promise(
							mutation($page, 'createCollection', {
								name,
								items: [
									{
										entryId: $page.data.entry.id
									}
								]
							}).finally(() => invalidate('entry')),
							{
								loading: 'Creating collection...',
								success: 'Created collection and added entry',
								error: 'Failed to create collection'
							}
						);
					}
				}
			});
			unsubscribe();
		}

		return {
			subscribe: store.subscribe,
			set: store.set,
			update: store.update,
			open,
			close,
			addToCollection,
			open_items: <TItem>(
				items: Array<TItem>,
				{
					onSelect,
					render,
					placeholder
				}: {
					onSelect?: (item: TItem) => void;
					render?: (item: TItem) => string;
					placeholder?: string;
				}
			) => {
				store.set({
					open: true,
					placeholder: placeholder ?? '',
					items,
					component: null,
					onSelect,
					render,
					shouldFilter: true,
					props: undefined
				});
			}
		};
	}

    export const commanderStore = createCommanderStore();

	export const getCommanderContext = (): typeof commanderStore => {
		const context = getContext('cmdk_commander');
		if (!context) {
			throw new Error('Commander context not found');
		}
		return context as typeof commanderStore;
	};
</script>

<script lang="ts">
	import type { Page } from '@sveltejs/kit';
	import {
		getContext,
		setContext,
		type ComponentProps,
		type ComponentType,
		type SvelteComponent
	} from 'svelte';
	import { toast } from 'svelte-sonner';
	import { writable } from 'svelte/store';

	import { invalidate } from '$app/navigation';
	import { page as page_store } from '$app/stores';
	import { cmd_open } from '$lib/components/ui/command/stores';
	import {
		CommandDialog,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList
	} from '$lib/components/ui/command2';
	import { mutation } from '$lib/queries/query';
	import { update_entry } from '$lib/state/entries';

	import Collections from './Collections.svelte';

	const search = writable('');
	const pages = writable<Array<string>>([]);

	export let placeholder = 'Type a command or search...';

	setContext('cmdk_commander', commanderStore);
	$: page = $pages[$pages.length - 1];
	$: page, search.set('');
	$: if (!$commanderStore.open) {
		$pages = [];
		search.set('');
		$commanderStore.shouldFilter = false;
	}

	commanderStore.subscribe((commanderStore) => {
		cmd_open.set(commanderStore.open);
	});

	export const open = () => {
		$commanderStore.open = true;
	};

</script>

<slot />

<!-- class="rounded-lg border border-gray-100  shadow-md  dark:border-gray-800" -->
<!-- shouldFilter={commanderStore.shouldFilter} -->
<CommandDialog
	bind:open={$commanderStore.open}
>
	<CommandInput bind:value={$search} placeholder={$commanderStore.placeholder} />
	<CommandList class="scrollbar-hide">
		<!-- <CommandEmpty>No results found.</CommandEmpty> -->
		{#if $commanderStore.component}
			<svelte:component this={$commanderStore.component} {...$commanderStore.props} />
		{:else if $commanderStore.items}
			{#each $commanderStore.items as item}
				{#if Array.isArray(item)}{/if}
				<CommandGroup>
					<CommandItem
						onSelect={() => {
							$commanderStore.onSelect?.(item);
							commanderStore.close();
						}}>{@html $commanderStore.render ? $commanderStore.render(item) : item}</CommandItem
					>
				</CommandGroup>
			{/each}
		{/if}
	</CommandList>
</CommandDialog>

<style lang="postcss">
	/* :global([data-cmdk-list]) {
		height: min(300px, var(--cmdk-list-height));
		max-height: 400px;
		overflow: auto;
		-ms-scroll-chaining: none;
		overscroll-behavior: contain;
		transition: 0.1s ease;
		transition-property: height;
	} */
</style>
