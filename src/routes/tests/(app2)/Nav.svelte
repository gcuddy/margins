<script>
	import { page } from "$app/stores";
	import Button from "$lib/components/ui/Button.svelte";
	import { LayoutList, Library, Rss, SearchIcon } from "lucide-svelte";

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
		{
			label: "Collections",
			href: "/tests/collections",
			icon: LayoutList,
			active: (url) => url.startsWith("/tests/collections"),
		},
		{
			label: "Search",
			href: "/tests/search",
			icon: SearchIcon,
			active: (url) => url.startsWith("/tests/search?type=my"),
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
			<svelte:component this={nav_item.icon} class="h-6 w-6 lg:h-4 lg:w-4" />
			<span class="hidden lg:inline">{nav_item.label}</span>
		</Button>
	{/each}
	<!-- <Button variant="ghost">Subscriptions</Button> -->
</nav>
