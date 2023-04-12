<script>
	import { page } from "$app/stores";
	import { cn } from "$lib/utils/tailwind";
	import Commander from "../../(app)/Commander.svelte";
	import Nav from "./Nav.svelte";
	// export let data;

	// $: isEntry = $page.route.id?.includes("entry");
	let isEntry = false;
</script>

<Commander>
	<div
		class={cn("container grid gap-12", !isEntry && "md:grid-cols-[200px_1fr]")}
	>
		<aside
			class={cn(
				"sticky top-0 hidden w-[200px] flex-col self-start md:flex",
				isEntry && "md:hidden"
			)}
		>
			<Nav />
		</aside>
		<main class="flex w-full flex-1 flex-col">
			<slot />
		</main>
	</div>
</Commander>
