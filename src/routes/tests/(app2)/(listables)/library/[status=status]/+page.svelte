<script lang="ts">
	import { beforeNavigate, goto, invalidate } from '$app/navigation';
	import { navigating, page } from '$app/stores';
	import EntryItemSkeleton from '$lib/components/entries/EntryItemSkeleton.svelte';
	import EntryList from '$lib/components/entries/EntryList.svelte';
	import Cluster from '$lib/components/helpers/Cluster.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Kbd from '$lib/components/ui/KBD.svelte';
	import Label from '$lib/components/ui/Label.svelte';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle
	} from '$lib/components/ui/dialog';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import { H1, Small } from '$lib/components/ui/typography';
	import type { LibraryResponse } from '$lib/server/queries';
	import { types } from '$lib/types';
	import { cn } from '$lib/utils/tailwind';
	import debounce from 'just-debounce-it';
	import { FilterIcon, Loader2Icon, Plus, XIcon } from 'lucide-svelte';
	import toast from 'svelte-french-toast';
	import { superForm } from 'sveltekit-superforms/client';
	import type { Snapshot } from './$types';
	import LibraryTabs from './LibraryTabs.svelte';
	import inView from '$lib/actions/inview';
	import { useMenuBar } from '../../../MainNav.svelte';
	import { invalidated, state } from '$lib/state/entries';
	import { fade } from 'svelte/transition';
	import { onDestroy } from 'svelte';
	import { check_inert } from '$lib/utils';

	$: filter_type = $page.url.searchParams.get('type');
	export let data;
	let value = $page.url.searchParams.get('search') ?? '';

	let filtered_entries = data.entries;

	$: {
		const regexQuery = new RegExp(value, 'i');
		filtered_entries = data.entries?.filter((entry) => entry.title?.match(regexQuery));
	}

	let can_restore = false;

	$: if ($navigating) {
		console.log({ $invalidated });
		can_restore = $navigating.type === 'popstate' && !$invalidated;
	}

	let entryList: EntryList;

	export const snapshot: Snapshot = {
		capture: () => ({
			data,
			list: entryList?.capture()
		}),
		restore: (values) => {
			if (!can_restore) return;

			// how can I 'sync' the newly fetched data with the old data?
			// if the values exist in state, we should utilitize those isntead

			// this only works if data is fresh fresh...
			// data.entries = values.data.entries.map((entry) => {
			// 	const state_entry = $state[entry.id]
			// 	if (state_entry) {
			// 		return state_entry;
			// 	}
			// 	return entry;
			// });
			data.entries = values.data.entries;
			data.next = values.data.next;

			if (values.list) {
				entryList?.restore(values.list);
			}
		}
	};

	const { enhance: enhance_add_url } = superForm(data.urlForm, {
		invalidateAll: false,
		onSubmit: () => {
			add_url_promise = new Promise((resolve) => {
				resolve_add_url_promise = resolve;
			});
			toast.promise(add_url_promise, {
				loading: 'Adding URL...',
				success: 'URL added!',
				error: 'Failed to add URL.'
			});
		},
		onResult: async () => {
			console.log('HELLLOOOOO');
			url_modal = false;
			resolve_add_url_promise({});
			console.log({ add_url_promise });
			invalidate('entries');
			// queryClient.invalidateQueries({
			// 	queryKey: ['library']
			// });
		},
		taintedMessage: null
	});

	let add_url_promise: Promise<any> | null = null;
	let resolve_add_url_promise: (value: any) => void;
	let url_modal = false;

	let filter: Input;
	let container: HTMLElement;

	function handle_keydown(e: KeyboardEvent) {
		if (check_inert(container)) return;
		if (e.key === '/') {
			e.preventDefault();
			filter.focus();
		}
		// let 1 2 and 3 move you to backlog, now, and archive
		if (e.key === '1') {
			e.preventDefault();
			goto(`/tests/library/backlog`);
		}
		if (e.key === '2') {
			e.preventDefault();
			goto(`/tests/library/now`);
		}
		if (e.key === '3') {
			e.preventDefault();
			goto(`/tests/library/archive`);
		}
	}

	let library_tabs: LibraryTabs;
	let loading = false;
	let loading_more = false;

	async function more() {
		// could also pass in endpoint ala https://github.com/Rich-Harris/sveltesnaps/blob/main/src/routes/%5Baccount%5D/%2Bpage.svelte
		// but this is fine for now
		console.log('fetching more', {
			loading_more,
			next: data.next
		});

		if (loading_more || !data.next) return;
		loading_more = true;

		const { updatedAt, sort_order } = data.next;
		console.log({
			updatedAt,
			sort_order
		});
		const response = await fetch(
			`/api/entries/library/${data.status}.json?after_sort=${sort_order}&after_updated=${updatedAt}`
		);
		const result = (await response.json()) as LibraryResponse;

		// mutate data object (!)
		data.entries = [...data.entries, ...result.entries];
		data.next = result.next;

		loading_more = false;
	}
	$: {
		console.log({ next: data.next });
	}

	let form: HTMLFormElement;
	const debounced_submit = debounce(() => {
		if (typeof HTMLFormElement.prototype.requestSubmit === 'function') {
			form.requestSubmit();
		}
	}, 200);

	$: is_searching = $navigating?.to?.url.pathname === $page.url.pathname;

	const menu = useMenuBar();
	$menu.html = 'Library';

	onDestroy(() => {
		$menu.html = '';
		$menu.center = false;
	});
</script>

<svelte:window on:keydown={handle_keydown} />

<div
	bind:this={container}
	use:inView
	on:exit={() => {
		$menu.center = true;
	}}
	on:enter={() => {
		$menu.center = false;
	}}
	class="flex items-center justify-between"
>
	<H1>{data.Status}</H1>
	<div class="flex items-center gap-x-2">
		<Dialog bind:isOpen={url_modal}>
			<svelte:fragment slot="trigger">
				<form on:submit|preventDefault action="/tests/library/add">
					<Button size="sm" class="relative">
						<Plus class="mr-2 h-4 w-4" />
						Add URL
					</Button>
				</form>
			</svelte:fragment>
			<DialogContent>
				<form action="/tests?/addUrl" method="post" use:enhance_add_url>
					<DialogHeader>
						<DialogTitle>Add URL</DialogTitle>
						<DialogDescription>Copy and paste the URL or ISBN to add.</DialogDescription>
					</DialogHeader>
					<div class="grid gap-4 py-4">
						<div class="grid gap-2">
							<Label for="url">URL or ISBN</Label>
							<Input
								name="url"
								id="url"
								placeholder="https://example.com/article, 0801856736, etc."
							/>
						</div>
					</div>
					<DialogFooter>
						<Button>Save</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	</div>
</div>
<!-- tabs -->
<div class="z-10 mt-4 flex items-center justify-between gap-x-4">
	<div class="flex items-center gap-x-4">
		<LibraryTabs bind:this={library_tabs} />

		<Popover let:close>
			<PopoverTrigger
				class={cn(!filter_type && buttonVariants({ variant: 'outline', size: 'sm' }), 'border-dashed')}
			>
				{#if filter_type}
					<Badge variant="secondary" class="">
						{filter_type}
					</Badge>
				{:else}
					<FilterIcon class="mr-2 h-4 w-4" />
					Filter
				{/if}
			</PopoverTrigger>
			<PopoverContent>
				<Small>Filter</Small>
				<!-- <div class="flex gap-x-1 overflow-x-auto scrollbar-hide">
			</div> -->
				<Cluster class="gap-1">
					{#each types as type}
						{@const selected = filter_type === type.toLowerCase()}
						<Button
							on:click={async () => {
								filter_type = selected ? '' : type.toLowerCase();
								const url = $page.url;
								invalidated.set(true);
								if (filter_type) url.searchParams.set('type', filter_type);
								else url.searchParams.delete('type');
								goto(url, {
									keepFocus: true,
									replaceState: true,
									noScroll: true,
									invalidateAll: true
								});
								close(null);
								// invalidate('entries');
							}}
							variant={selected ? 'secondary' : 'outline'}
							size="sm"
						>
							{type}
						</Button>
					{/each}
				</Cluster>
			</PopoverContent>
		</Popover>
		{#if filter_type}
			<div class="flex">
				<Button as="a" href={$page.url.pathname} variant="ghost" size="sm">
					Reset <XIcon class="ml-2 h-4 w-4" />
				</Button>
			</div>
		{/if}
	</div>
	<form
		bind:this={form}
		class="group relative mt-4 max-w-xs"
		data-sveltekit-keepfocus
		data-sveltekit-replacestate
	>
		<Input
			bind:this={filter}
			{value}
			on:input={debounced_submit}
			placeholder="Filter in list..."
			type="text"
			name="search"
		/>

		<Kbd class="absolute bottom-0 right-1.5 top-0 my-auto group-focus-within:hidden">/</Kbd>
		{#if is_searching}
			<div
				class="absolute bottom-0 right-1.5 top-0 my-auto flex flex-col items-center justify-center"
			>
				<Loader2Icon class="h-4 w-4 animate-spin text-muted-foreground" />
			</div>
		{/if}
	</form>
</div>
{#if loading}
	<div class="flex flex-col">
		<EntryItemSkeleton />
		<EntryItemSkeleton />
		<EntryItemSkeleton />
		<EntryItemSkeleton />
		<EntryItemSkeleton />
	</div>
{:else}
	<EntryList
		bind:this={entryList}
		class="mt-4"
		status={data.status}
		bulkForm={data.bulkForm}
		on:move={(e) => {
			library_tabs.move_entries(e.detail.entries, e.detail.status);
			// mutate data object (!)
			e.detail.entries.forEach((entry) => {
				const index = data.entries.findIndex((e) => e.id === entry.id);
				data.entries[index].status = e.detail.status;
			});
		}}
		entries={data.entries?.filter((e) => e.status === data.Status)}
		on:end={more}
	/>
	{#if data.next}
		<a
			href="{$page.url.pathname}?after_sort={data.next.sort_order}&after_updated={data.next
				.updatedAt}">next page</a
		>
	{/if}
{/if}
