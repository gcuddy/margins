<script lang="ts">
	import { getPopoverContext } from "$lib/components/ui/popover/Popover.svelte";

	import { PopoverButton } from "@rgossiaux/svelte-headlessui";
	import type { ComponentProps, SvelteComponent } from "svelte";

	const elements = [
		"a",
		"address",
		"article",
		"aside",
		"b",
		"bdi",
		"bdo",
		"blockquote",
		"button",
		"cite",
		"code",
		"data",
		"datalist",
		"dd",
		"dl",
		"dt",
		"div",
		"em",
		"footer",
		"form",
		"h1",
		"h2",
		"h3",
		"h4",
		"h5",
		"h6",
		"header",
		"i",
		"input",
		"label",
		"li",
		"main",
		"nav",
		"ol",
		"p",
		"section",
		"span",
		"strong",
		"ul",
	] as const;
	type SupportedElement = (typeof elements)[number];

	interface $$Props
		extends ComponentProps<
			PopoverButton<SupportedElement | typeof SvelteComponent>
		> {
		class?: string;
	}

	const { popperRef } = getPopoverContext();
</script>

<!-- Portal? -->
<PopoverButton use={[popperRef]} {...$$restProps}>
	<slot />
</PopoverButton>
