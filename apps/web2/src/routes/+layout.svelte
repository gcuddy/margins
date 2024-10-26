<script>
	import Theme from '$lib/ui/theme.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<Theme class="text-3 font-default font-normal h-screen w-screen flex flex-col">
	{@render children()}
</Theme>
