<script lang="ts">
	// import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import Editor from '../Editor.svelte';
	// import NoteSidebar from './NoteSidebar.svelte';
	export let data;

	export let editor: Editor;
</script>

<div class="flex max-h-[calc(100vh-7rem)] gap-x-4">
	<Editor bind:this={editor} data={data.form} />
	<!-- <Card class="max-w-sm flex-initial overflow-y-auto">
		<CardHeader>
			<CardTitle>Notes</CardTitle>
		</CardHeader>
		<CardContent>
			<NoteSidebar
				on:entry={(e) => {
					console.log(e);
					editor.update((d) => {
						let body = d.body;
						body += `[[${e.detail}]]`;
						return {
							...d,
							body,
						};
					});
				}}
			/>
		</CardContent>
	</Card> -->
</div>
