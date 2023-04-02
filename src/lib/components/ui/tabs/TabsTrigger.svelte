<script lang="ts">
	import { Tab } from "@rgossiaux/svelte-headlessui";
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";
	import type { ComponentProps } from "svelte";
	// let className: string | undefined | null = "";
	// export { className as class };
	interface $$Props extends ComponentProps<Tab<"div" | "a">> {
		// class?: string | null;
	}
</script>

<Tab
	draggable="false"
	class={({ selected }) =>
		cn(
			"inline-flex min-w-[100px] items-center justify-center rounded-[0.185rem] px-3 py-1.5  text-sm font-medium text-gray-700 transition-all  disabled:pointer-events-none disabled:opacity-50 dark:text-gray-200 ",
			selected &&
				"bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-gray-100",
			$$props.class
		)}
	{...$$restProps}
>
	<slot />
</Tab>
