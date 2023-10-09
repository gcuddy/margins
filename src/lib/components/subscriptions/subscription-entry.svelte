<script lang="ts">
	import { Form } from 'formsnap';
	import { onDestroy } from 'svelte';
	import { toast } from 'svelte-sonner';
	import type { SuperValidated } from 'sveltekit-superforms';

	import { page } from '$app/stores';
	import { Button } from '$components/ui/button';
	import { Checkbox } from '$components/ui/checkbox';
	import { Input } from '$components/ui/input';
	import Label from '$components/ui/Label.svelte';
	import { Muted } from '$components/ui/typography';

	import type { ActionData } from '../../../routes/tests/(app2)/(listables)/subscriptions/$types';
	import {
		type FeedSearchFormSchema,
		feedSearchFormSchema,
	} from './subscription-entry.schema';

	export let searchForm: SuperValidated<FeedSearchFormSchema>;

	export let form: ActionData;

	// TODO: version of formsnap where you don't have to pass schema in just to get type...

	$: noFeedsFound = form && 'feeds' in form && !form.feeds?.feeds.length;

	export let showFeeds = false;

	$: if (form && 'feeds' in form && form?.feeds && form.feeds?.feeds.length) {
		showFeeds = true;
	}

	$: if (noFeedsFound) {
		toast('No feeds found!');
	}

    onDestroy(() => {
        form = undefined;
        showFeeds = false;
    })
</script>

{#if showFeeds && form && 'feeds' in form && form?.feeds && form.feeds?.feeds.length}
<!-- <button on:click={() => {
    showFeeds = false;
}}>
    go back
</button> -->
	<form
		action="/tests/subscriptions?/add"
		method="post"
		class="flex flex-col gap-y-4 px-3"
	>
		<fieldset class="space-y-4">
			<legend><Muted>Feeds</Muted></legend>
			{#each form.feeds.feeds as feed, index}
				{@const id = `feed-${index}`}
				<div class="space-y-0.5">
					<div class="flex grid-cols-12 gap-x-2 gap-y-1">
						{#if form.feeds.feeds.length > 1}
							<div class="flex shrink-0 items-center justify-center">
								<Checkbox
									name="{index}-url"
									value={feed.url}
									id="feed-checkbox-{index}"
									checked={index === 0}
								/>
							</div>
						{:else}
							<input
								type="hidden"
								name="{index}-url"
								value={feed.url}
							/>
						{/if}
						<div
							class="{form.feeds.feeds.length > 1
								? 'col-start-2'
								: 'col-start-1'} col-end-13 grow"
						>
							<Input
								{id}
								autofocus={index === 0 ? true : undefined}
								value={feed.title}
								name="{index}-title"
								class=""
							/>
						</div>
					</div>
					<div class="col-span-full flex justify-end pr-2">
						<Label class="row-start-2" for="feed-checkbox-{index}">
							<Muted class="text-xs">{feed.url}</Muted>
						</Label>
					</div>
				</div>
			{/each}
		</fieldset>
		<div
			class="flex justify-end border-t border-gray-500 pt-4 dark:border-gray-700"
		>
			<Button type="submit">Save</Button>
		</div>
	</form>
{:else}
	<Form.Root
		method="post"
		action="/tests/subscriptions?/search"
		form={searchForm}
		schema={feedSearchFormSchema}
		let:config
		debug
	>
		<Form.Field {config} name="url">
			<Form.Label>URL</Form.Label>
			<Form.Input />
			<Form.Description>
				Enter a URL to search for a feed to subscribe to.
			</Form.Description>
			<Form.Validation />
		</Form.Field>
		<Button type="submit">Search</Button>
	</Form.Root>
{/if}
