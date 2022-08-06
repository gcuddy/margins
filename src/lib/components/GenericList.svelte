<script lang="ts">
	type T = $$Generic;
	export let items: T[];
	export let idResolver: (item: T) => string = (item) => (item as any).id;
</script>

<ul>
	{#each items as item (idResolver(item))}
		<li>
			<span>{item.title}</span>
		</li>
	{/each}
</ul>
