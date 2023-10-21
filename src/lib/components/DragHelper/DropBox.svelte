<script lang="ts">
	import { useQueryClient } from '@tanstack/svelte-query';
	import { BookPlus } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { toast } from 'svelte-sonner';

	import type { AddUrlObj } from '$lib/schemas';
	import dragging from '$lib/stores/dragging';
	import { syncStore } from '$lib/stores/sync';
	import { post } from '$lib/utils/forms';
	import { queryFactory } from '$lib/queries/querykeys';

	let dragOver = false;

	const queryClient = useQueryClient();

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragOver = true;
	}
	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
	}
	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		const url = e.dataTransfer?.getData('text/uri-list');
		if (url) {
			const syncId = syncStore.addItem();
			const context_url = e.dataTransfer?.getData('context/url');
			const context_entryid = e.dataTransfer?.getData('context/id');
			submitLink(url, {
				entryId: context_entryid ? +context_entryid : undefined,
				url: context_url,
			}).then(() => syncStore.removeItem(syncId));
		}
		$dragging = false;
	}
	async function submitLink(
		url: string,
		context: { entryId?: number; url?: string },
	) {
		// todo: only want context if it comes from this page - figure out how to do that
		// i guess i need to add drag handlers to every link (and image?) on the page, which seems... annoying
		const promise = post<AddUrlObj>('/s?/addUrl', {
			status: 'Backlog',
			url,
			via_entryid: context.entryId,
		});
		toast.promise(promise, {
			error: 'Failed to save link',
			loading: 'Saving link',
			success: (data) => {
				queryClient.invalidateQueries(queryFactory.entries.list());
				if (data.type === 'success' && data.data) {
					return `Saved new link: ${data.data.title}`;
				}
				return 'Saved link';
			},
		});
		// invalidateAll();
		// toast.success(`'Saved link');
		// const article = await trpc($page).public.parse.query({url});
		// const bookmark = await trpc($page).bookmarks.add.mutate({
		// 	article,
		// 	url,
		// 	context,
		// });
		// notifications.notify({
		// 	type: 'success',
		// 	title: 'Saved link',
		// });
	}
</script>

{#if $dragging}
	<div class="fixed bottom-5 left-5 z-50 sm:bottom-9 sm:left-9">
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			in:fly|global={{ duration: 250, x: -100 }}
			out:fade|global={{ duration: 250 }}
			class="before:content-['drop to add to inbox'] grid place-content-center rounded-full border bg-accent p-12 text-accent-foreground shadow-xl transition duration-500 before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-accent/90 before:p-12 before:transition {dragOver
				? 'before:scale-[2.5] before:opacity-100'
				: 'before:scale-[1.2] before:opacity-0'}"
			on:dragover={handleDragOver}
			on:dragleave={handleDragLeave}
			on:drop={handleDrop}
		>
			<span
				class="pointer-events-none absolute left-0 top-0 -z-10 -mt-10 w-full text-center text-xs font-bold text-accent-foreground transition-opacity {dragOver
					? 'opacity-100'
					: 'opacity-0'}"
			>
				Drop to add URL to inbox</span
			>
			<span
				class="pointer-events-none relative flex items-center space-x-2 font-semibold transition {dragOver
					? 'scale-125'
					: ''}"
			>
				<BookPlus class="h-8 w-8" />
			</span>
		</div>
	</div>
{/if}
