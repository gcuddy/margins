<script lang="ts">
	import { MagnifyingGlass } from 'svelte-radix';
	let { children, data } = $props();
</script>

<div class="flex flex-col">
	<div class="divide-y flex flex-col h-full">
		<form class="px-4 flex gap-2 items-center py-3">
			<MagnifyingGlass class="size-5" />
			<!-- svelte-ignore a11y_autofocus -->
			<input
				autofocus
				type="text"
				name="q"
				class="text-6 bg-transparent outline-none text-gray-12 w-full py-2"
				value={data.q}
			/>
		</form>
		<div class="flex">
			<a href="/search">your stuff</a>
			<a href="/search/books">Books</a>
		</div>
		<div class="overflow-y-auto py-2">
			{@render children()}
		</div>
	</div>
</div>
