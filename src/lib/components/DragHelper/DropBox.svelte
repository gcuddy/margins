<script lang="ts">
	import dragging from '$lib/stores/dragging';
	import { notifications } from '$lib/stores/notifications';
	import { syncStore } from '$lib/stores/sync';
	import { fade } from 'svelte/transition';
	import Icon from '../helpers/Icon.svelte';
	let dragOver = false;
	let dropping = false;
	let draggedUrl = '';
	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragOver = true;
	}
	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
	}
	function handleDrop(e: DragEvent) {
		dropping = true;
		e.preventDefault();
		dragOver = false;
		console.log(e);
		console.log(e.relatedTarget || e.fromElement);
		const url = e.dataTransfer?.getData('text/uri-list');
		console.log({ url });
		if (url) {
			const syncId = syncStore.addItem();
			const contextUrl = e.dataTransfer?.getData('context-url');
			const contextId = e.dataTransfer?.getData('context-id');
			console.log({ contextUrl, contextId });
			submitLink(url, { id: contextId, url: contextUrl }).then(() => syncStore.removeItem(syncId));
		}
		$dragging = false;
		dropping = false;
	}
	async function submitLink(url: string, context?: { id?: string; url?: string }) {
		// todo: only want context if it comes from this page - figure out how to do that
		// i guess i need to add drag handlers to every link (and image?) on the page, which seems... annoying
		const form = new FormData();
		form.set('text', url);
		if (context?.url) form.set('context-url', context.url);
		if (context?.id) form.set('context-id', context.id);
		console.log({ form });
		fetch('/add', {
			method: 'POST',
			body: form,
		})
			.then(() => {
				notifications.notify({
					message: 'Saved link',
				});
			})
			.catch((e) => {
				console.error(e);
				notifications.notify({
					message: 'Error saving link',
				});
			});
		// notifications.notify({
		// 	message: 'Link submitted'
		// });
	}
</script>

{#if $dragging}
	<div class="fixed bottom-5 left-5 z-50 sm:bottom-9 sm:left-9">
		<div
			transition:fade={{ duration: 250 }}
			class="before:content-['drop to add to inbox'] grid place-content-center  rounded-full border border-amber-600 bg-amber-300 p-12 text-black shadow-xl transition duration-500 before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-amber-400 before:p-12 before:transition {dragOver
				? 'before:scale-[2.5] before:opacity-100'
				: 'before:opacity-0 before:scale-[1.2]'}"
			on:dragover={handleDragOver}
			on:dragleave={handleDragLeave}
			on:drop={handleDrop}
		>
			<span
				class="pointer-events-none absolute top-0 left-0 -z-10 -mt-10 w-full text-center text-xs font-bold text-white transition-opacity {dragOver
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
				<Icon name="inboxIn" className="h-10 w-10 stroke-2 stroke-amber-900" />
			</span>
		</div>
	</div>
{/if}
