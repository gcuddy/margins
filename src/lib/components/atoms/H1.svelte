<script lang="ts">
	export let lg = true;
	let classname = '';
	export { classname as class };
</script>

<h1 class="text-3xl font-semibold tracking-tight md:text-4xl {lg && 'lg:text-5xl'} {classname}">
	<slot />
</h1>
