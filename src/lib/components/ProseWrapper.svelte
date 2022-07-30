<script lang="ts">
	let className = '';
	export { className as class };
	export let breakpoints = true;
</script>

<div
	class="prose prose-neutral prose-amber mx-auto block break-words transition prose-a:transition prose-figure:drop-shadow-sm prose-figcaption:mx-auto  prose-figcaption:max-w-sm prose-figcaption:text-center prose-img:mx-auto  prose-img:rounded dark:prose-invert  {breakpoints
		? 'md:prose-lg'
		: ''} {className}"
>
	<slot />
</div>
