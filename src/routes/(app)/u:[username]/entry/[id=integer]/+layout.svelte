<script lang="ts">
	import { goto } from "$app/navigation";
	import Button, { buttonVariants } from "$lib/components/ui/Button.svelte";
	import {
		DropdownMenu,
		DropdownMenuTrigger,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuShortcut,
	} from "$lib/components/ui/dropdown-menu";
	import { getCurrentListContext } from "$lib/stores/currentList";
	import { checkIfKeyboardShortcutsAllowed } from "$lib/stores/keyboard";
	import { mainEl, mainElScroll } from "$lib/stores/main";
	import { cn } from "$lib/utils/tailwind";
	import { MoreVertical, Tag, X } from "lucide-svelte";
	import { tweened } from "svelte/motion";
	const currentList = getCurrentListContext();

	async function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape" && checkIfKeyboardShortcutsAllowed()) {
			if ($currentList.slug) {
				await goto($currentList.slug);
			}
		}
	}

	const topBarHeight = tweened(56, {
		duration: 200,
	});
	// $: $mainElScroll.down ? topBarHeight.set(0) : topBarHeight.set(56);
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $currentList.entries?.length}
	<div
		class="flex flex-col overflow-hidden rounded-lg border border-border bg-transparent shadow-lg backdrop-blur-lg transition sm:m-4"
	>
		<div
			style:--height="{$topBarHeight}px"
			class={cn(
				"flex h-[--height] shrink-0 items-center justify-between border-b px-3 transition hover:opacity-100",
				$mainElScroll.down && "opacity-25"
			)}
		>
			<Button
				as="a"
				href={$currentList.slug}
				variant="subtle"
				class="h-10 w-10 rounded-full p-3"
			>
				<X class="stroke-muted" />
			</Button>
			<!-- TODO: next and previous, name of current list, index and remaining items -->
			<!-- TODO -->
			<DropdownMenu>
				<DropdownMenuTrigger
					class={cn(
						buttonVariants({
							class: "h-10 w-10 rounded-full p-3",
							variant: "subtle",
						})
					)}
				>
					<MoreVertical class="stroke-muted" />
				</DropdownMenuTrigger>
				<DropdownMenuContent class="w-56">
					<DropdownMenuItem>
						<Tag class="mr-2 h-4 w-4" />
						<span>Add tags</span>
						<DropdownMenuShortcut>T</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem>Billing</DropdownMenuItem>
					<DropdownMenuItem>Team</DropdownMenuItem>
					<DropdownMenuItem>Subscription</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
		<div bind:this={$mainEl} class="overflow-y-auto">
			<slot />
		</div>
	</div>
{:else}
	<slot />
{/if}
