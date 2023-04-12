<script>
	import { page } from "$app/stores";
	import Button from "$lib/components/ui/Button.svelte";
	import { Library, Rss } from "lucide-svelte";

	/**
	 * @type {{label: string; icon: import("svelte").ComponentType; href: string; active: (url: string) => boolean;}[]}
	 */
	const nav = [
		{
			label: "Library",
			href: "/tests/library/backlog",
			icon: Library,
			active: (url) => url.startsWith("/tests/library"),
		},
		{
			label: "Subscriptions",
			href: "/tests/subscriptions",
			icon: Rss,
			active: (url) => url.startsWith("/tests/subscriptions"),
		},
	];
</script>

<nav class="grid items-start gap-2">
	{#each nav as nav_item}
		<Button
			as="a"
			href={nav_item.href}
			size="sm"
			class="flex w-full items-center justify-start space-x-2"
			variant={nav_item.active($page.url.pathname) ? "subtle" : "ghost"}
		>
			<svelte:component this={nav_item.icon} class="h-4 w-4" />
			<span>{nav_item.label}</span>
		</Button>
	{/each}
	<!-- <Button variant="ghost">Subscriptions</Button> -->
</nav>
