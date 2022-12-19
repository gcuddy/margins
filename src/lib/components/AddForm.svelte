<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type parse from '$lib/parse';
	import { modals } from '$lib/stores/modals';
	import { notifications } from '$lib/stores/notifications';
	import type { Location } from '$lib/types/schemas/Locations';
	import MiniSwitch from './atoms/MiniSwitch.svelte';
	import Button from './Button.svelte';
	import GenericInput from './GenericInput.svelte';
	import GenericTextarea from './GenericTextarea.svelte';
	import Icon from './helpers/Icon.svelte';
	import LinkPreview from './LinkPreview.svelte';
	import LocationListbox from './LocationListbox.svelte';
	import TagEntry from './TagEntry.svelte';

	export let url = '';
	export let location: Location = 'INBOX';

	let textarea: HTMLElement | undefined;
	let input: HTMLElement | undefined;

	export let modalControls = false;

	let fetched_data: Awaited<ReturnType<typeof parse>> | undefined = undefined;
	let url_error = false;
</script>

<!-- modal: transparent etc -->
<form
	class="space-y-2 text-lg"
	action="/add"
	method="post"
	use:enhance={({ form, data, action, cancel }) => {
		// `form` is the `<form>` element
		// `data` is its `FormData` object
		// `action` is the URL to which the form is posted
		// `cancel()` will prevent the submission
		modals.close({
			id: 'add-url',
		});
		console.log($modals);
		return ({ result, update }) => {
			update();
			if (result.type === 'fail') {
				notifications.notify({
					type: 'error',
					message: 'Missing URL',
				});
			}
			modals.close({
				id: 'add-url',
			});
		};
	}}
>
	<div class="flex flex-col gap-4">
		<div class="flex justify-between px-2">
			<div class="flex items-center gap-2">
				<LocationListbox
					tooltip={{
						text: 'Location',
					}}
					{location}
					on:change={(e) => {
						location = e.detail;
					}}
					includeAll={false}
					includeIcon={true}
					variant="button"
					size="xs"
				/>
				{#if fetched_data}
					<div
						class="flex h-6 items-center gap-2 rounded px-2 text-sm dark:bg-gray-600 dark:text-gray-300"
					>
						<span>{fetched_data.title || '[No title]'}</span>
						{#if fetched_data.image}
							<img class="h-full p-1" src={fetched_data.image} alt="" />
						{/if}
					</div>
				{/if}
			</div>
			{#if modalControls}
				<div class="flex items-center gap-1">
					<Button
						variant="naked"
						tooltip={{
							text: 'Expand',
						}}><Icon name="arrowsPointingOutMini" className="h-4 w-4 fill-gray-500" /></Button
					>
					<Button
						variant="naked"
						on:click={() => {
							modals.close({
								id: 'add-url',
							});
						}}
						tooltip={{
							text: 'Dismiss',
							kbd: 'Escape',
						}}><Icon name="xMarkMini" className="h-4 w-4 fill-gray-500" /></Button
					>
				</div>
			{/if}
		</div>
		<label for="url" class="sr-only">Enter a URL to save:</label>
		<div class="flex items-center">
			<GenericInput
				data-initial-focus
				type="text"
				name="url"
				bind:el={input}
				bind:value={url}
				variant="naked"
				placeholder="Article url"
				class="text-lg {url_error ? '!text-red-500' : ''}"
				on:input={() => {
					url_error = false;
				}}
				on:keydown={(e) => {
					console.log({ e });
					if (e.key === 'Enter') {
						e.preventDefault();
						textarea?.focus();
					}
					// if cursor is at the end of the input, and the user presses down arrow, focus the textarea
				}}
				on:blur={async () => {
					if (!url) return;
					try {
						const u = new URL(url);
						const res = await fetch(`/api/parse?url=${encodeURIComponent(u.href)}`);
						fetched_data = await res.json();
					} catch (e) {
						console.error(e);
						url_error = true;
					}
				}}
			/>
			<!-- <div class="h-12 w-12 flex-shrink-0 gap-4">
				{#if fetched_data?.image}
					<img src={fetched_data.image} class=" rounded-md object-cover" alt="" />
				{/if}
			</div> -->
		</div>
		<GenericTextarea
			bind:el={textarea}
			name="note"
			placeholder="Add note…"
			rows={1}
			variant="naked"
		/>
		<div class="flex items-center">
			<TagEntry className="grow" allTags={$page.data.allTags} />
		</div>
		<div class="flex max-w-full items-center justify-end gap-4 px-2">
			<MiniSwitch
				class="flex items-center justify-between gap-1 text-sm text-gray-500"
				label="Private"
				size="xs"
				enabled
				labelOnRight
				name="private"
			/>
			<MiniSwitch
				class="flex items-center justify-between gap-1 text-sm text-gray-500"
				label="Read Later"
				size="xs"
				enabled
				labelOnRight
				name="readLater"
			/>
			<Button type="submit" size="lg" className="place-self-end space-x-2"
				><span>Save article</span></Button
			>
		</div>
	</div>
</form>
