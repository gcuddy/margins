<script lang="ts">
	let { children } = $props();
</script>

<div class="flex flex-col">
    <div class="flex">
        <a href="/search">your stuff</a>
        <a href="/search/books">Books</a>
    </div>
	{@render children()}
</div>
