<script lang="ts">
	import type { ContextualAnnotation } from "$lib/prisma/selects/annotations";
	import Annotation from "./Annotation.svelte";
	import AutoAnimate from "./helpers/AutoAnimate.svelte";

	let c = "";
	export { c as class };
	export let annotations: ContextualAnnotation[];
</script>

<AutoAnimate class={c}>
	{#each annotations as annotation}
		<Annotation {annotation} showParent={true} showEntry={true} />
	{/each}
</AutoAnimate>
