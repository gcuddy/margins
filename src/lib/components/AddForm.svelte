<script lang="ts">
	import { enhance } from "$app/forms";
	import { invalidate, invalidateAll } from "$app/navigation";
	import { page } from "$app/stores";
	import type parse from "$lib/parse";
	import toast from "svelte-french-toast";
	import { modals } from "$lib/stores/modals";
	import { notifications } from "$lib/stores/notifications";
	import { trpc, trpc } from "$lib/trpc/client";
	import type { RouterOutputs } from "$lib/trpc/router";
	import type { Location } from "$lib/types/schemas/Locations";
	import { getUser } from "@lucia-auth/sveltekit/client";
	import type { State } from "@prisma/client";
	import {
		createMutation,
		createQuery,
		useQueryClient,
	} from "@tanstack/svelte-query";
	import { fade } from "svelte/transition";
	import MiniSwitch from "./atoms/MiniSwitch.svelte";
	import Button from "./Button.svelte";
	import GenericInput from "./GenericInput.svelte";
	import GenericTextarea from "./GenericTextarea.svelte";
	import Icon from "./helpers/Icon.svelte";
	import LinkPreview from "./LinkPreview.svelte";
	import LocationListbox from "./LocationListbox.svelte";
	import StateCombobox from "./StateCombobox.svelte";
	import TagEntry from "./TagEntry.svelte";
	import TypeListbox from "./TypeListbox.svelte";

	export let url = "";
	export let location: Location = "inbox";
	export let stateId: number = $page.data.user?.default_state_id as number;
	export let state: State = $page.data.user?.states?.find(
		(s) => s.id === stateId
	) as State;
	export const test = "hello";
	$: console.log({ location });

	let textarea: HTMLElement | undefined;
	let input: HTMLElement | undefined;

	export let modalControls = false;

	let fetched_data: Awaited<ReturnType<typeof parse>> | undefined = undefined;
	let url_error = false;

	let loading = false;

	const user = getUser();

	console.log({ $modals });

	let articleToAdd: RouterOutputs["public"]["parse"] | null = null;

	async function parse() {
		return await fetch(`/api/parse/${encodeURIComponent(url)}`, {
            method: "GET",
        }).then((res) => res.json());
	}

	$: query = createQuery({
		queryKey: ["parse", url],
		queryFn: parse,
		retry: false,
		enabled: false,
		staleTime: 1000 * 60,
		refetchOnWindowFocus: false,
		onSuccess: (data) => {
			articleToAdd = data;
		},
	});

	// TODO: screenshot if bookmark (see /add/page.server.ts)
	const queryClient = useQueryClient();
	const client = trpc($page);
	const utils = client.createContext();
	const addMutation = client.bookmarks.add.createMutation({
		onMutate: (data) => {
			// TODO: optimistic update
			if (data?.stateId) {
				// place it in respective state query, if that exists
			}
		},
		onSuccess: (data) => {
			// Invalidte all queries? queryClient.invalidateQueries()
			toast.success("Added bookmark!");
			utils.entries.invalidate();
		},
	});

	createMutation({
		mutationFn: () =>
			trpc($page).bookmarks.add.mutate({
				// TODO: fix types mismatch
				article: articleToAdd,
				url: articleToAdd?.uri || articleToAdd?.url || url,
			}),
		// TODO: come up with something a bit more sophisticated
		onSuccess: (data) => {
			// invalidate
			// or: invalidateAll()?
			console.log("invalidating", data);
			queryClient.invalidateQueries({ queryKey: ["entries"] });
			// await invalidate("entries");
		},
	});

	$: console.log({ $query });
</script>

<!-- modal: transparent etc -->
<form
	class="space-y-2 text-lg"
	action="/u:{$user?.username}/add"
	method="post"
	use:enhance={async ({ form, data, action, cancel }) => {
		// `form` is the `<form>` element
		// `data` is its `FormData` object
		// `action` is the URL to which the form is posted
		// `cancel()` will prevent the submission
		// modals.close({
		// 	id: 'add-url',
		// });
		// Prevent form submission, we're going to do it ourselves with the cached data
		console.log({ articleToAdd });
		if (articleToAdd) {
			cancel();
			// TODO: Optimistic update
			console.log({ article: articleToAdd, url });
			$addMutation.mutate({
				article: articleToAdd,
				url: articleToAdd?.uri || url,
				originalUrl: url,
			});
			// TODO: invalidation
			modals.close({
				id: "add-url",
			});
			return;
		}
		// loading = true;
		// console.log({ $modals });
		// return async ({ result, update }) => {
		// 	if (result.type === "success") {
		// 		invalidateAll().then(() => {
		// 			console.log({ $modals });

		// 			modals.close({
		// 				id: "add-url",
		// 			});
		// 		});
		// 		return;
		// 	}
		// 	// update();
		// 	// await invalidateAll();
		// 	if (result.type === "error") {
		// 		console.error("ERROROR");
		// 		notifications.notify({
		// 			type: "error",
		// 			message: "Missing URL",
		// 		});
		// 		update();
		// 	}
		// };
	}}
>
	<div class="flex flex-col gap-4">
		<div class="flex justify-between px-2">
			<div class="flex min-w-0 items-center gap-2">
				<StateCombobox {state} />

				<!-- <LocationListbox
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
				/> -->
				{#if $query.isInitialLoading || $query.isSuccess}
					<div
						in:fade
						class="flex h-6 flex-1 items-center gap-2 truncate rounded px-2 text-sm dark:bg-gray-600 dark:text-gray-300"
					>
						{#if $query.isInitialLoading}
							<Icon name="loading" className="h-4 w-4 animate-spin" />
						{:else if $query.isSuccess && $query.data}
							{#if $query.data.image}
								<img class="h-full p-1" src={$query.data.image} alt="" />
							{/if}
							<span class="truncate">{$query.data.title || "[No title]"}</span>
						{/if}
					</div>
				{/if}
			</div>
			{#if modalControls}
				<div class="flex items-center gap-1">
					<Button
						variant="naked"
						tooltip={{
							text: "Expand",
						}}
						><Icon
							name="arrowsPointingOutMini"
							className="h-4 w-4 fill-gray-500"
						/></Button
					>
					<Button
						variant="naked"
						on:click={() => {
							modals.close({
								id: "add-url",
							});
						}}
						tooltip={{
							text: "Dismiss",
							kbd: "Escape",
						}}
						><Icon name="xMarkMini" className="h-4 w-4 fill-gray-500" /></Button
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
					if (e.key === "Enter") {
						e.preventDefault();
						textarea?.focus();
					}
					// if cursor is at the end of the input, and the user presses down arrow, focus the textarea
				}}
				on:blur={async () => {
					if (!url) return;
					try {
						new URL(url);
						$query.refetch();
						// const res = await fetch(`/api/parse?url=${encodeURIComponent(u.href)}`);
						// fetched_data = await res.json();
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
		<div class="flex w-full justify-between px-2">
			<!-- TODO: better component -->
			<TypeListbox selected={$query.data?.type || "article"} />
			<div class="flex max-w-full items-center justify-end gap-4">
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
				<Button
					type="submit"
					size="lg"
					disabled={loading}
					className="place-self-end space-x-2"
				>
					{#if !loading}<span>Save article</span>
					{:else}
						<Icon
							name="loading"
							className="h-5 w-5 animate-spin text-current"
						/>
					{/if}
				</Button>
			</div>
		</div>
	</div>
</form>
