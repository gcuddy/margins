<script>
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/Input.svelte';
	import Label from '$lib/components/ui/Label.svelte';
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogDescription,
		DialogFooter,
		DialogTrigger
	} from '$lib/components/ui/dialog';
	import { H1 } from '$lib/components/ui/typography';
	import { name } from '$lib/icons';
	import { Loader2, PlusCircle } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms/client';
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import { queryFactory } from '$lib/queries/querykeys';
	export let data;

	const query = createInfiniteQuery(
		queryFactory.collections.list({
			filter: {
				or: [
					{
						name: {
							contains: 'china'
						}
					},
					{
						name: {
							contains: 'CHCC'
						}
					}
				]
			}
		})
	);

	$: console.log({ $query });

	const { enhance, form, constraints, errors, delayed, submitting } = superForm(data.form, {
		onUpdated: (data) => {
			toast.success('Collection created!');
			new_collection_modal = false;
		},
		resetForm: true
	});

	let new_collection_modal = false;

	let filter_value = '';
	$: filtered_collections = data.collections.filter((collection) => {
		return collection.name.toLowerCase().includes(filter_value.toLowerCase());
	});
</script>

<div class="flex items-center justify-between">
	<H1>Collections</H1>

	<Dialog bind:open={new_collection_modal}>
		<DialogTrigger asChild let:builder>
			<Button builders={[builder]}>
				<PlusCircle class="mr-2 h-4 w-4" />
				New Collection</Button
			>
		</DialogTrigger>
		<DialogContent>
			<form use:enhance class="contents" method="post">
				<DialogHeader>
					<DialogTitle>New Collection</DialogTitle>
					<DialogDescription>Enter a name for your new collection</DialogDescription>
				</DialogHeader>
				<div class="flex items-center gap-4">
					<Label for="collection-name">Name</Label>
					<Input
						name="name"
						bind:value={$form.name}
						id="collection-name"
						placeholder="Collection Name"
						autocomplete="off"
						{...$constraints.name}
					/>
					{#if $errors.name}
						<div class="text-sm text-red-500">{$errors.name}</div>
					{/if}
				</div>
				<DialogFooter>
					<Button disabled={$submitting}>
						{#if $delayed}
							<Loader2 class="mr-2 h-4 w-4" />
						{/if}
						Save
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</div>
<div class="mt-4 flex flex-col space-y-4">
	<div class="max-w-sm">
		<Input bind:value={filter_value} placeholder="Filter…" type="text" />
	</div>
	{#each filtered_collections as { id, name, items }}
		<a
			class="flex items-center gap-x-4 text-xl font-semibold tracking-tighter"
			href="/tests/collection/{id}"
		>
			<div class="relative">
				{#if items[0]?.image}
					<img
						class="relative z-10 aspect-square w-16 rounded-md object-cover shadow"
						src={items?.[0]?.image}
						alt=""
					/>
				{:else}
					<div class="relative z-10 aspect-square w-16 rounded-md bg-muted shadow" />
				{/if}
				{#if items[1]?.image}
					<!-- show behind above image -->
					<img
						class=" absolute right-px top-0 z-0 aspect-square w-16 rotate-12 rounded-md object-cover opacity-50 shadow"
						src={items?.[1]?.image}
						alt=""
					/>
				{/if}
				{#if items[2]?.image}
					<!-- show behind above image -->
					<img
						class=" absolute -top-1 left-px z-0 aspect-square w-16 -rotate-6 rounded-md object-cover opacity-50 shadow"
						src={items?.[2]?.image}
						alt=""
					/>
				{/if}
			</div>
			{name}</a
		>
	{/each}
</div>
