<script>
	import { page } from "$app/stores";
	import { cn } from "$lib/utils/tailwind";

	const prefix = "/tests";
	const tabs = [
		{ name: "Backlog", href: "/library/backlog" },
		{ name: "Now", href: "/library/now" },
		{ name: "Archive", href: "/library/archive" },
	];
</script>

<div
	class="inline-flex items-center justify-center rounded-md bg-gray-100 p-1 dark:bg-gray-800"
>
	<!--  -->
	{#each tabs as { name, href }}
		{@const selected = $page.url.pathname === prefix + href}
		<a
			href={prefix + href}
			class={cn(
				"inline-flex min-w-[100px] items-center justify-center rounded-[0.185rem] px-3 py-1.5  text-sm font-medium text-gray-700 transition-all  disabled:pointer-events-none disabled:opacity-50 dark:text-gray-200 ",
				selected &&
					"bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-gray-100"
			)}
		>
			{name}
		</a>
	{/each}
</div>
