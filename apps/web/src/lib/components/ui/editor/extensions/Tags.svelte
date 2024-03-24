<script lang="ts">
	import Suggester from './Suggester.svelte';

	export let items: { id: number; name: string }[] = [];
</script>

<Suggester {items} {...$$restProps} let:item>
	<!--  -->
	<div>{item.name}</div>
</Suggester>
