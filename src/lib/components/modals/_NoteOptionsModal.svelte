<script lang="ts">
	import { notifications } from '$lib/stores/notifications';
	import { notebookArticles } from '$lib/stores/notebook';
	import type { Annotation, Highlight } from '@prisma/client';
	import { modals } from '$lib/stores/modals';
	import { browser } from '$app/env';
	export let endpoint: string;
	export let note: Annotation | Highlight;
	export let articleUrl: string;
	export let type: 'annotation' | 'highlight';
	function del() {
		fetch(endpoint, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((res) => {
			if (res.status === 200) {
				modals.close();
				notifications.notify({
					message: 'Successfully deleted'
				});
				if (note) {
					notebookArticles.update((n) => {
						const id = note.id;
						const index = n.findIndex((a) => a.id === id);
						if (index > -1) {
							// since these are two different types (string & number), this techinically should work...
							// buuuuut... it's just asking for state bugs
							n[index].annotations = n[index].annotations.filter((a) => a.id !== id);
							n[index].highlights = n[index].highlights.filter((a) => a.id !== id);
						}
						return n;
					});
				}
			}
		});
	}
	function copyLinkToHighlight() {
		// TODO: affordances for if it has images
		let url = `${articleUrl}#:~:text=`;
		const splitByWords = note.text.split(' ');
		if (splitByWords.length < 20) {
			url += encodeURIComponent(note.text);
		} else {
			const textStart = splitByWords.slice(0, 3).join(' ');
			const textEnd = splitByWords.slice(-3).join(' ');
			url += encodeURIComponent(textStart) + ',' + encodeURIComponent(textEnd);
		}
		console.log({ url });
		if (browser) {
			modals.close();
			navigator.clipboard.writeText(url);
			notifications.notify({
				message: 'Copied link to highlight to clipboard',
				type: 'success'
			});
		}
	}
</script>

<!-- TODO: add copy link to highlight (only works in chrome) -->
<button class="py-3" on:click={del}>Delete Note</button>
<button class="py-3">Add to List…</button>
{#if type === 'highlight' && note.text.length > 0 && browser}
	<!-- only use where supported -->
	{#if 'fragmentDirective' in Location.prototype || 'fragmentDirective' in document}
		<button class="py-3" on:click={copyLinkToHighlight}
			>Copy Link to Highlight in Original Web Page<br />
			<small>(Only works in chrome)</small></button
		>
	{/if}
{/if}
<button class="py-3" on:click={() => modals.close()}>Cancel</button>
