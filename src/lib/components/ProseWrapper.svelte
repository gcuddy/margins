<script lang="ts">
	let className = '';
	export { className as class };
	export let breakpoints = true;
	export let el: HTMLElement | undefined = undefined;
	export let style: string | undefined = undefined;
</script>

<!-- <wrapper
		class="prose prose-neutral prose-amber mx-auto block break-words transition prose-a:transition prose-figure:drop-shadow-sm prose-figcaption:mx-auto  prose-figcaption:max-w-sm prose-figcaption:text-center prose-img:mx-auto  prose-img:rounded dark:prose-invert dark:prose-a:saturate-50 dark:hover:prose-a:saturate-100 md:prose-lg lg:prose-xl"
		style="grid-column: {$layoutMode === 'read' ? 2 : 1};"
	>ob -->
<div
	bind:this={el}
	on:click
	class="prose prose-stone mx-auto block break-words font-serif transition prose-a:transition  hover:prose-a:text-primary-700 prose-figure:drop-shadow-sm prose-figcaption:mx-auto  prose-figcaption:max-w-sm prose-figcaption:text-center prose-img:mx-auto  prose-img:rounded dark:prose-invert  {breakpoints
		? 'md:prose-lg lg:prose-xl'
		: ''} {className}"
	{style}
>
	<slot />
</div>
