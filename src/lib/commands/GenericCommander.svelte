<script lang="ts" context="module">
	export function commanderStore() {
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
			console.log('OPENN');
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

	export const getCommanderContext = (): ReturnType<typeof commanderStore> => {
		const context = getContext('cmdk_commander');
		if (!context) {
			throw new Error('Commander context not found');
		}
		return context as ReturnType<typeof commanderStore>;
	};
</script>

<script lang="ts">
	import type { Page } from '@sveltejs/kit';
	import {
		type ComponentProps,
		type ComponentType,
		getContext,
		setContext,
		type SvelteComponent	} from 'svelte';
	import { writable } from 'svelte/store';
	import { toast } from 'svelte-sonner';

	import { invalidate } from '$app/navigation';
	import { page as page_store } from '$app/stores';
	import Scroller from '$lib/components/Scroller.svelte';
	import {
		CommandDialog,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList
	} from '$lib/components/ui/command';
	import { cmd_open } from '$lib/components/ui/command/stores';
	import { mutation } from '$lib/queries/query';
	import { update_entry } from '$lib/state/entries';

	import Collections from './Collections.svelte';

	const search = writable('');
	const pages = writable<Array<string>>([]);

	export let placeholder = 'Type a command or search...';

	const store = commanderStore();
	setContext('cmdk_commander', store);
	$: page = $pages[$pages.length - 1];
	$: page, search.set('');
	$: if (!$store.open) {
		$pages = [];
		search.set('');
		$store.shouldFilter = false;
	}

	store.subscribe((store) => {
		console.log(`Setting cmd_open to ${store.open}`);
		cmd_open.set(store.open);
	});

	export const open = () => {
		$store.open = true;
	};
</script>

<slot />

<!-- class="rounded-lg border border-gray-100  shadow-md  dark:border-gray-800" -->
<CommandDialog
	shouldFilter={$store.shouldFilter}
	isOpen={$store.open}
	onKeydown={(e) => {
		console.log('custom', e.key, $search);
		if (e.key === 'Escape' || (e.key === 'Backspace' && !$search)) {
			e.preventDefault();
			$pages = $pages.slice(0, -1);
		}
	}}
>
	<CommandInput bind:value={$search} placeholder={$store.placeholder} />
	<CommandList class="scrollbar-hide">
		<!-- <CommandEmpty>No results found.</CommandEmpty> -->
		{#if $store.component}
			<svelte:component this={$store.component} {...$store.props} />
		{:else if $store.items}
			{#each $store.items as item}
				{#if Array.isArray(item)}{/if}
				<CommandGroup>
					<CommandItem
						onSelect={() => {
							$store.onSelect?.(item);
							store.close();
						}}>{@html $store.render ? $store.render(item) : item}</CommandItem
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
