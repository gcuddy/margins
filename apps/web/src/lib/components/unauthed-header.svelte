<script lang="ts">
	import Breadcrumbs, { type Path } from './breadcrumbs.svelte';
	import Header from './ui/Header.svelte';
	import { Button } from './ui/button';
	export let path: Path = [];
	let className: string | null | undefined = undefined;
	export { className as class };
</script>

<Header class={className}>
	<Breadcrumbs {path} />
	<div class="flex w-auto items-center justify-end">
		<Button href="/login" variant="ghost">Login or Sign Up</Button>
	</div></Header
>
