import type Icon from "$lib/components/helpers/Icon.svelte";
import type { IconName } from "$lib/icons";
import type { ComponentProperties } from "$lib/stores/types";

export interface MenuItem {
	label: string;
	icon?: IconName;
	iconProps?: ComponentProperties<Icon>;
	check?: () => boolean;
	perform?: () => void;
	href?: string;
	enabled?: boolean;
	kbd?: string[];
	items?: MenuItem[];
}
