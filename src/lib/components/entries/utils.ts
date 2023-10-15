import type { AddUrlObj } from '$lib/schemas';
import { post } from '$lib/utils/forms';
import { toast } from 'svelte-sonner';

export function saveUrl(url: string, viaEntryId?: number, onDone?: () => void) {
	console.log({ url, viaEntryId });
	toast.promise(
		post<AddUrlObj>('/s?/addUrl', {
			url,
			status: 'Backlog',
			via_entryid: viaEntryId,
		}).finally(() => {
			onDone?.();
		}),
		{
			loading: 'Saving...',
			success: 'Saved!',
			error: 'Failed to save.',
		},
	);
}
