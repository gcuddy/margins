<script>
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import { Loader2, PlusCircle } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms/client';

	import Header from '$components/ui/Header.svelte';
	import { Button } from '$lib/components/ui/button';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle,
		DialogTrigger,
	} from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import { queryFactory } from '$lib/queries/querykeys';
	import Label from '$components/ui/Label.svelte';
	import Separator from '$components/ui/Separator.svelte';
	export let data;

	// const query = createInfiniteQuery(
	// 	queryFactory.collections.list({
    //         filter: {
    //             or: [
    //                 {
    //                     name: {
    //                         contains: 'test',
    //                     },
    //                 }
    //             ]
    //         }
    //     }),
	// );

    // $: console.log({$query})

	const { constraints, delayed, enhance, errors, form, submitting } = superForm(
		data.form,
		{
			onUpdated: (data) => {
				toast.success('Collection created!');
				new_collection_modal = false;
			},
			resetForm: true,
		},
	);

	let new_collection_modal = false;

	let filter_value = '';
	$: filtered_collections = data.collections.filter((collection) => {
		return collection.name.toLowerCase().includes(filter_value.toLowerCase());
	});
</script>

<Header>
	<span class="text-xl tracking-tight font-bold">Collections</span>
	<svelte:fragment slot="end">
		<Dialog bind:open={new_collection_modal}>
			<DialogTrigger asChild let:builder>
				<Button variant="outline" size='sm' builders={[builder]}>
					<PlusCircle class="mr-2 h-4 w-4" />
					New Collection</Button
				>
			</DialogTrigger>
			<DialogContent>
				<form use:enhance class="contents" method="post">
					<DialogHeader>
						<DialogTitle>New Collection</DialogTitle>
						<DialogDescription
							>Enter a name for your new collection</DialogDescription
						>
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
	</svelte:fragment>
</Header>

<div class="mt-4 flex flex-col">
	<div class="max-w-sm">
		<Input bind:value={filter_value} placeholder="Filter…" type="text" />
	</div>
	{#each filtered_collections as { id, items, name }}
		<a
			class="flex items-center gap-x-4 text-xl font-semibold tracking-tighter px-6 py-4"
			href="/collection/{id}"
		>
			<div class="relative">
				{#if items[0]?.image}
					<img
						class="relative z-10 aspect-square w-16 rounded-md object-cover shadow"
						src={items?.[0]?.image}
						alt=""
					/>
				{:else}
					<div
						class="relative z-10 aspect-square w-16 rounded-md bg-muted shadow"
					/>
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
        <Separator class="w-full h-[0.5px] bg-border" />
	{/each}
</div>
