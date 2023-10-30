<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { derived } from 'svelte/store';
	import { toast } from 'svelte-sonner';

	import { initBookmarkCreateMutation } from '$lib/queries/mutations';
	import { queryFactory } from '$lib/queries/querykeys';
	import { getHostname, isValidUrl } from '$lib/utils';
	import { page } from '$app/stores';

	// TODO: list entries query to check if url there

	const bookmarkCreateMutation = initBookmarkCreateMutation();
	const entriesQuery = createQuery(derived(page, $page => ({...queryFactory.entries.all(), enabled: !!$page.data.user_data})));

	const entryUrls = derived(
		entriesQuery,
		($query) => $query.data?.map((entry) => entry.uri).filter(Boolean) ?? [],
		[],
	);

	const ignoredUrls: Array<string> = [];

	const urlsToExistingNotificationsMap = new Map<string, string | number>();

	async function handleVisibilityChange() {
		if (document.visibilityState === 'visible') {
			try {
				const text = await navigator.clipboard.readText();
				if (
					isValidUrl(text) &&
					!$entryUrls.includes(text) &&
					!ignoredUrls.includes(text) &&
					!urlsToExistingNotificationsMap.has(text)
				) {
					const toastId = toast(
						`URL detected in clipboard — add to your library?`,
						{
							action: {
								label: 'Save',
								onClick() {
									toast.promise(
										$bookmarkCreateMutation.mutateAsync({
											url: text,
										}),
										{
											error: 'Failed to save',
											loading: 'Saving...',
											success: 'Saved!',
										},
									);
								},
							},
							description: getHostname(text),
							descriptionClass: 'text-sm truncate !text-muted-foreground',
							duration: 1000 * 10,
							onAutoClose: () => {
								urlsToExistingNotificationsMap.delete(text);
							},
							onDismiss: () => {
								ignoredUrls.push(text);
								urlsToExistingNotificationsMap.delete(text);
							},
						},
					);
					urlsToExistingNotificationsMap.set(text, toastId);
				}
			} catch {
				// console.error('Failed to read clipboard contents: ', err);
			}
		}
	}
</script>

<svelte:document
	on:load={handleVisibilityChange}
	on:visibilitychange={handleVisibilityChange}
/>
