<script lang="ts">
	import * as Form from '$components/ui/form';
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
	import { ChevronLeft, ArrowRight } from 'radix-icons-svelte';
	import { Loader2 } from 'lucide-svelte';

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
	});
</script>

{#if showFeeds && form && 'feeds' in form && form?.feeds && form.feeds?.feeds.length}
	<div>
		<Button
			on:click={() => {
				showFeeds = false;
			}}
			variant="ghost"
			size="sm"
		>
			<ChevronLeft class="h-4 w-4 mr-1" />
			Go back
		</Button>
	</div>
	<!-- <button on:click={() => {
    showFeeds = false;
}}>
    go back
</button> -->
	<form
		action="/tests/subscriptions?/add"
		method="post"
		class="flex flex-col gap-y-4 px-3 min-w-0"
	>
		<fieldset class="space-y-4 min-w-0">
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
							<input type="hidden" name="{index}-url" value={feed.url} />
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
						<Label class="row-start-2 truncate" for="feed-checkbox-{index}">
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
		let:submitting
		class="space-y-8"
	>
		<Form.Field {config} name="url">
			<div class="space-y-2">
				<Form.Label>URL</Form.Label>
				<Form.Input />
				<Form.Description>Enter a URL to subscribe to.</Form.Description>
				<Form.Validation />
			</div>
		</Form.Field>
		<div
			class="flex justify-end sm:flex-row sm:justify-end sm:space-x-2 flex-col-reverse"
		>
        <!-- {submitting} -->
			<Form.Button disabled={submitting}
				>Find feed{#if submitting}
					<Loader2 class="animate-spin ml-2 h-4 w-4" />
				{:else}
					<ArrowRight class="ml-2 h-4 w-4" />
				{/if}</Form.Button
			>
		</div>
	</Form.Root>
{/if}
