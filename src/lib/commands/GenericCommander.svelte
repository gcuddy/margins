<script lang="ts" context="module">
	export function commanderStore() {
		const store = writable<{
			open: boolean;
			shouldFilter: boolean;
			placeholder: string;
			component: ComponentType | null;
			onSelect?: (item: any) => void;
			props?: Record<string, any>;
			items?: any[] | any[][];
			/** only relevant if items passed in, renders html string */
			render?: (item: any) => string;
		}>({
			open: false,
			shouldFilter: false,
			placeholder: '',
			component: null,
			onSelect: undefined
		});

		return {
			subscribe: store.subscribe,
			set: store.set,
			update: store.update,
			open: <Component extends SvelteComponentTyped>({
				placeholder = '',
				component,
				props,
				shouldFilter = false
			}: {
				placeholder?: string;
				shouldFilter?: boolean;
				component: ComponentType<Component>;
				props?: ComponentProps<Component>;
			}) => {
				console.log('OPENN');
				store.set({
					open: true,
					placeholder,
					shouldFilter,
					component,
					props
				});
			},
			close: () => {
				store.set({
					open: false,
					placeholder: '',
					component: null,
					props: undefined,
					shouldFilter: false
				});
			},
			open_items: <TItem>(
				items: TItem[],
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

	export const getCommanderContext = () => {
		const context = getContext('cmdk_commander');
		if (!context) {
			throw new Error('Commander context not found');
		}
		return context as ReturnType<typeof commanderStore>;
	};
</script>

<script lang="ts">
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
	import {
		type ComponentProps,
		type ComponentType,
		type SvelteComponent,
		getContext,
		setContext
	} from 'svelte';
	import { writable } from 'svelte/store';

	const search = writable('');
	const pages = writable<string[]>([]);

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
		console.log(`Setting cmd_open to ${store.open}`)
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

<style>
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
