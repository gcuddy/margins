<script lang="ts">
	import { page } from "$app/stores";
	import Button from "$lib/components/Button.svelte";
	import EntryList from "$lib/components/EntryList.svelte";
	import GenericInput from "$lib/components/GenericInput.svelte";
	import EntryFilter from "$lib/features/entries/EntryFilter.svelte";
	import EntryFilterDisplay from "$lib/features/entries/EntryFilterDisplay.svelte";
	import { trpc } from "$lib/trpc/client";
    let name = ""
	// TODO: snapshot of the filter
    // export const snasphot...
</script>

<EntryFilter let:query let:where let:chosenConditions>
	<div class="my-4 mx-5 flex rounded bg-gray-100 dark:bg-gray-800  ">
		<form class="w-full">
			<div class="flex flex-col space-y-2 divide-y p-4 dark:divide-gray-700">
				<div class="w-full space-y-2">
					<GenericInput bind:value={name} class="grow !bg-transparent font-medium" placeholder="Untitled smart list" />
					<!-- <GenericTextarea
					placeholder="Description (optional)"
					class="grow resize-none !bg-transparent text-sm"
					rows={1}
				/> -->
				</div>
				<div class="flex flex-col gap-4 pt-4 md:flex-row md:justify-between">
					<div class="grow space-y-2">
						<EntryFilterDisplay />
					</div>
					<div class="flex space-x-2">
						<Button variant="link" as="a" href="/u:{$page.data.user?.username}/smart">Cancel</Button>
						<Button on:click={() => {
                            console.log({where, chosenConditions})
                            trpc().filters.save.mutate({
                                conditions: chosenConditions,
                                filter: where,
                                name
                            })
                        }} variant="primary">Save</Button>
					</div>
				</div>
			</div>
		</form>
	</div>

	{#if query.isInitialLoading}
		<div>Loading...</div>
	{/if}

	{#if query.isSuccess && query.data}
		<EntryList items={query.data} />
	{/if}
</EntryFilter>
