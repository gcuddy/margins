<script lang="ts">
	import dragging from '$lib/stores/dragging';
	import { notifications } from '$lib/stores/notifications';
	import { fade } from 'svelte/transition';
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
			const contextUrl = e.dataTransfer?.getData('context-url');
			const contextId = e.dataTransfer?.getData('context-id');
			submitLink(url, { id: contextId, url: contextUrl });
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
			body: form
		})
			.then(() => {
				notifications.notify({
					message: 'Saved link'
				});
			})
			.catch((e) => {
				console.error(e);
				notifications.notify({
					message: 'Error saving link'
				});
			});
		// notifications.notify({
		// 	message: 'Link submitted'
		// });
	}
</script>

{#if $dragging}
	<div
		transition:fade={{ duration: 250 }}
		class="fixed bottom-9 left-9 z-50 rounded-full bg-yellow-300 px-4 py-9 text-black hover:bg-yellow-700 hover:ring {dragOver
			? 'bg-yellow-700 ring'
			: ''}"
		on:dragover={handleDragOver}
		on:dragleave={handleDragLeave}
		on:drop={handleDrop}
	>
		<span class="text-2xl font-bold">Drop here to add to inbox</span>
	</div>
{/if}
