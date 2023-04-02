<script lang="ts">
	import { useDropDownMenuContext } from "$lib/components/ui/dropdown-menu/DropdownMenu.svelte";
	import { MenuButton } from "@rgossiaux/svelte-headlessui";
	import type { ComponentProps } from "svelte";
	const state = useDropDownMenuContext("DropdownMenuContent");
	const { popperRef } = $state;
	interface $$Props extends ComponentProps<MenuButton<"button">> {}
</script>

<MenuButton {...$$restProps} use={[popperRef]}><slot>Open</slot></MenuButton>
