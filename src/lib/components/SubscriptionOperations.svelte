<script lang="ts">
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuShortcut,
		DropdownMenuTrigger,
	} from "$lib/components/ui/dropdown-menu";
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogFooter,
		DialogDescription,
	} from "$lib/components/ui/dialog";

	import { cn } from "$lib/utils/tailwind";
	import type { Subscription } from "@prisma/client";
	import { ListPlus, MoreHorizontal, RefreshCwIcon, Tag } from "lucide-svelte";
	import Input from "$lib/components/ui/input/input.svelte";

	import Button from "$lib/components/ui/Button.svelte";

	import { page } from "$app/stores";
	import { invalidateAll } from "$app/navigation";
	import toast from "svelte-french-toast";
	let c = "";
	export { c as class };
	type SubscriptionProps = RouterOutputs["subscriptions"]["list"][number];
	export let subscription: SubscriptionProps | null = null;
	let newTitle = subscription?.subscription_title ?? "";
	let showRenameDialog = false;

	const client = trpc($page);
	const ctx = client.createContext();

	const mutation = client.subscriptions.update.createMutation({
		// TODO
		onSuccess: async () => {
			await ctx.subscriptions.list.invalidate();
			await invalidateAll();
			toast.success("Subscription renamed");
			showRenameDialog = false;
		},
	});
</script>

<DropdownMenu>
	<DropdownMenuTrigger
		class={cn(
			"flex h-8 w-8 items-center justify-center rounded-md  transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700",
			c
		)}
	>
		<slot>
			<MoreHorizontal class="h-4 w-4 stroke-muted" /></slot
		>
	</DropdownMenuTrigger>
	<DropdownMenuContent class="w-56">
		<DropdownMenuItem on:click={() => (showRenameDialog = true)}>
			<span>Rename</span>
		</DropdownMenuItem>
		<DropdownMenuItem>
			<span>Add tags</span>
		</DropdownMenuItem>
		{#if subscription}
			<DropdownMenuSeparator />
			<DropdownMenuItem>
				<span>Unsubscribe</span>
			</DropdownMenuItem>
		{/if}
	</DropdownMenuContent>
</DropdownMenu>

{#if subscription}
	<Dialog isOpen={showRenameDialog}>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Rename subscription</DialogTitle>
				<DialogDescription
					>Rename {subscription?.subscription_title} to:</DialogDescription
				>
			</DialogHeader>
			<div class="py-1">
				<Input id="name" bind:value={newTitle} />
			</div>
			<DialogFooter>
				<Button
					disabled={$mutation.isLoading}
					on:click={() => {
						if (!subscription || !newTitle) return;
						$mutation.mutate({
							id: subscription.subscription_id,
							data: {
								title: newTitle,
							},
						});
					}}>Save</Button
				>
			</DialogFooter>
		</DialogContent>
	</Dialog>
{/if}
