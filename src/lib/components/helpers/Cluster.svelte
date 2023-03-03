<script lang="ts">
	import { classNames } from "$lib/utils/tailwind";
	let c = "";
	export { c as class };
    $: classes = classNames(c);
</script>

<ul class="cluster {classes}">
	<slot />
</ul>

<style lang="postcss">
	.cluster {
		@apply flex flex-wrap items-center justify-start;
	}
</style>
