import type { RelationType } from "@prisma/client";
import { ArrowLeftIcon, ArrowLeftRightIcon, GroupIcon } from "lucide-svelte";
import type { ComponentType } from "svelte";

export const relations_icons: Record<RelationType, ComponentType> = {
    Grouped: GroupIcon,
    Related: ArrowLeftRightIcon,
    SavedFrom: ArrowLeftIcon
}