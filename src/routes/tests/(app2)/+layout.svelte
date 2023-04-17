<script>
	import { page } from "$app/stores";
	import MainNav from "$lib/components/MainNav.svelte";
	import { cn } from "$lib/utils/tailwind";
	import Commander from "../../(app)/Commander.svelte";
	import Nav from "./Nav.svelte";
	// export let data;

	// $: isEntry = $page.route.id?.includes("entry");
	let isEntry = false;
</script>

<Commander>
	<div class="flex flex-col space-y-6">
		<header class="container sticky top-0 z-40">
			<!-- dfdfd -->
			<div
				class="flex h-16 items-center justify-between border-b border-b-slate-200 py-4"
			>
				<MainNav />
				<!-- <MainNav items={dashboardConfig.mainNav} />
				<UserAccountNav
				  user={{
					name: user.name,
					image: user.image,
					email: user.email,
				  }}
				/> -->
			</div>
		</header>
		<div
			class={cn(
				"container grid gap-12",
				!isEntry && "md:grid-cols-[auto_1fr] lg:grid-cols-[200px,1fr]"
			)}
		>
			<!-- w-[200px] -->
			<aside
				class={cn(
					"sticky top-20 hidden flex-col self-start md:flex",
					isEntry && "md:hidden"
				)}
			>
				<Nav />
			</aside>
			<main class="flex w-full flex-1 flex-col">
				<slot />
			</main>
		</div>
	</div>
</Commander>
