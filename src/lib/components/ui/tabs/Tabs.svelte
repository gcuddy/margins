<script lang="ts">
	import { TabGroup, TabPanels } from "@rgossiaux/svelte-headlessui";
	import type { ComponentProps } from "svelte";
	interface $$Props extends ComponentProps<TabGroup<"div">> {}
</script>

<TabGroup {...$$restProps}>
	<slot />
	<TabPanels let:selectedIndex>
		<slot name="panels" {selectedIndex} />
	</TabPanels>
</TabGroup>
