<script lang="ts">
	import type { PageData } from '../../../../.svelte-kit/types/src/routes/add/$types';
	export let data: PageData;
	$: ({ url, title, description, html } = data);
</script>

<div>
	<form class="space-y-2" action="/add" method="post">
		<div class="flex gap-3">
			<label for="url">URL</label><input type="text" name="url" value={url} />
		</div>
		<div class="flex gap-3">
			<label for="title">Title</label><input name="title" type="text" value={title} />
		</div>
		<div class="flex gap-3">
			<label for="description">Description</label><textarea
				name="description"
				id="description"
				cols="30"
				rows="10"
				value={description}
			/>
		</div>
		<div class="flex gap-3"><label for="Tags">Tags</label><input type="text" name="tags" /></div>
		<!-- if we're submitting a bookmark, this matters below — not sure if this should be for both read-later and bookmarks, tho -->
		<input type="hidden" name="html" value={html} />
		<button type="submit">Submit</button>
	</form>
</div>
