<script>
	import {
		createCurrentListStore,
		setCurrentListContext,
	} from "$lib/stores/currentList";

	export let data;

	$: console.log({ data });

	const currentList = createCurrentListStore();
	setCurrentListContext(currentList);
</script>

<slot />
