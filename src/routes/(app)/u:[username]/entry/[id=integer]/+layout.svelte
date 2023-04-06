<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import EntryOperations from "$lib/components/EntryOperations.svelte";
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
	import { ListPlus, MoreVertical, RefreshCwIcon, Tag, X } from "lucide-svelte";
	import { getContext } from "svelte";
	import { tweened } from "svelte/motion";
	import type { Writable } from "svelte/store";
	const currentList = getCurrentListContext();

	async function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape" && checkIfKeyboardShortcutsAllowed()) {
			if ($currentList.slug) {
				await goto($currentList.slug);
			}
		}
	}

	const last_urls: Writable<string[]> = getContext("last_urls");
	// $: $mainElScroll.down ? topBarHeight.set(0) : topBarHeight.set(56);
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $currentList.entries?.length}
	<div
		class="flex flex-col overflow-hidden rounded-lg border border-border bg-transparent shadow-lg backdrop-blur-lg transition sm:m-2"
	>
		<div
			class={cn(
				"flex h-14 shrink-0 items-center justify-between border-b border-border px-3 transition hover:opacity-100"
			)}
		>
			<Button
				as="a"
				href={$currentList.slug}
				variant="subtle"
				class="h-10 w-10 rounded-full p-3"
				on:click={(e) => {
					if ($last_urls[0] === $currentList.slug) {
						// then just go back to the previous page
						e.preventDefault();
						history.back();
					}
				}}
			>
				<X class="stroke-muted" />
			</Button>
			<!-- TODO: next and previous, name of current list, index and remaining items -->
			<!-- TODO -->
			<EntryOperations
				class={cn(
					buttonVariants({
						class: "h-10 w-10 rounded-full border-none p-3",
						variant: "subtle",
					})
				)}
				entry={{ id: +$page.params.id }}
			/>
			<!-- <DropdownMenu>
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
					<DropdownMenuItem>
						<ListPlus class="mr-2 h-4 w-4" />
						<span>Add to Collection</span>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<RefreshCwIcon class="mr-2 h-4 w-4" />
						<span>Re-download data</span>
					</DropdownMenuItem>
					<DropdownMenuItem>Billing</DropdownMenuItem>
					<DropdownMenuItem>Team</DropdownMenuItem>
					<DropdownMenuItem>Subscription</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu> -->
		</div>
		<div bind:this={$mainEl} class="overflow-y-auto">
			<slot />
		</div>
	</div>
{:else}
	<EntryOperations
		class={cn(
			buttonVariants({
				class: "h-10 w-10 rounded-full border-none p-3",
				variant: "subtle",
			}),
			"fixed right-4 top-4 z-40 opacity-50 transition hover:opacity-100"
		)}
		entry={{ id: +$page.params.id }}
	/>
	<slot />
{/if}
