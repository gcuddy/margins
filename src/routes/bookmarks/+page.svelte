<script lang="ts">
	export let bookmarks: Bookmark[] = [];
</script>

{#each bookmarks as bookmark (bookmark.id)}
	<div>
		<h2>{bookmark.title || bookmark.url}</h2>
		<a href="/cached/{bookmark.id}">Cached</a>
		<div>{bookmark.url}</div>
		<p>{bookmark.description}</p>
		<span>{bookmark.createdAt}</span>
	</div>
{/each}
