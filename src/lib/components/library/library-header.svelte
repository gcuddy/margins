<script lang="ts">
	import { H1 } from '$components/ui/typography';
	import LibraryTabs from './library-tabs.svelte';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import { cn } from '$lib/utils/tailwind';
	import Button, { buttonVariants } from '$components/ui/Button.svelte';
	import Badge from '$components/ui/Badge.svelte';
	import { ArrowDownUpIcon, Check, FilterIcon, Loader2Icon, XIcon } from 'lucide-svelte';
	import { types } from '$lib/types';
	import debounce from 'just-debounce-it';
	import {
        Command,
		CommandInput,
		CommandGroup,
		CommandItem,
		CommandList
	} from '$components/ui/command';
	import DropdownMenu from '$components/ui/dropdown-menu/DropdownMenu.svelte';
	import DropdownMenuTrigger from '$components/ui/dropdown-menu/DropdownMenuTrigger.svelte';
	import DropdownMenuContent from '$components/ui/dropdown-menu/DropdownMenuContent.svelte';
	import DropdownMenuItem from '$components/ui/dropdown-menu/DropdownMenuItem.svelte';
	import { page, navigating } from '$app/stores';
	import { goto } from '$app/navigation';
	import Input from '$components/ui/Input.svelte';
	import Kbd from '$components/ui/KBD.svelte';
	import Header from '$components/ui/Header.svelte';

	let form: HTMLFormElement;
	let filter: Input;
	let value = $page.url.searchParams.get('search') ?? '';

	const debounced_submit = debounce(() => {
        if (typeof HTMLFormElement.prototype.requestSubmit === 'function') {
            form.requestSubmit();
		}
	}, 200);

	const handle_filter_input = (e: Event) => {
        const target = e.target as HTMLInputElement;
		const value = target.value;
		// TODO optimistic update by filtering the entries in js first
		// const regexQuery = new RegExp(value, 'i');
		// filtered_entries = data.entries?.filter((entry) => entry.title?.match(regexQuery));
		debounced_submit();
	};

	function handle_keydown(e: KeyboardEvent) {
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

    $: is_searching = $navigating?.to?.url.pathname === $page.url.pathname;
    $: filter_type = $page.url.searchParams.get('type');
</script>

<svelte:window on:keydown={handle_keydown} />
<!--  -->
<Header>
    <!-- class="flex flex-1 items-center justify-start gap-x-4" -->
    <svelte:fragment slot="start">
		<h1 class="font-extrabold tracking-tight text-3xl md:text-4xl">Library</h1>
		<!-- <H1>{data.Status}</H1> -->
        <LibraryTabs />
        <noscript>
            <!-- hm -->
        </noscript>

		<Popover let:close>
			<PopoverTrigger
				class={cn(
					!filter_type && buttonVariants({ variant: 'outline' }),
					'border-dashed'
				)}
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
			<PopoverContent placement="bottom-start" class="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Filter..." />
					<CommandList>
						<CommandGroup>
							{#each types as type}
								{@const selected = filter_type === type.toLowerCase()}
								<CommandItem
									onSelect={() => {
										filter_type = selected ? '' : type.toLowerCase();
										const url = $page.url;
										if (filter_type) url.searchParams.set('type', filter_type);
										else url.searchParams.delete('type');
										goto(url, {
											keepFocus: true,
											replaceState: true,
											noScroll: true,
											invalidateAll: true
										});
										close(null);
									}}
								>
									<div
										class={cn(
											'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
											selected
												? 'bg-primary text-primary-foreground'
												: 'opacity-50 [&_svg]:invisible'
										)}
									>
										<Check class={cn('h-4 w-4')} />
									</div>
									<span>
										{type}
									</span>
								</CommandItem>
								<!-- <Button
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
									}}
									variant={selected ? 'secondary' : 'outline'}
									size="sm"
								>
									{type}
								</Button> -->
							{/each}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
		{#if filter_type}
			<div class="flex">
				<Button as="a" href={$page.url.pathname} variant="ghost" size="sm">
					Reset <XIcon class="ml-2 h-4 w-4" />
				</Button>
			</div>
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="end">
		<DropdownMenu>
			<DropdownMenuTrigger class={buttonVariants({ variant: 'secondary' })}>
				<ArrowDownUpIcon class="h-4 w-4 mr-2" />
				Sort
			</DropdownMenuTrigger>
			<DropdownMenuContent placement="bottom">
				<DropdownMenuItem>Name</DropdownMenuItem>
				<DropdownMenuItem>Author</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
		<form
			bind:this={form}
			class="group hidden md:flex relative"
			data-sveltekit-keepfocus
			data-sveltekit-replacestate
		>
			<Input
				bind:this={filter}
				{value}
				on:input={handle_filter_input}
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
	</svelte:fragment>
</Header>