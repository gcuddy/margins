<script lang="ts">
	import {
		ArrowUpCircle,
		CheckCircle2,
		Circle,
		HelpCircle,
		XCircle,
	} from "lucide-svelte";

	// LucideIco/n,
	// import { cn } from $lib/utils/tailwind"
	import {
		Command,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList,
	} from "$lib/components/ui/command";
	import {
		Popover,
		PopoverContent,
		PopoverTrigger,
	} from "$lib/components/ui/popover";
	import Button, { buttonVariants } from "./ui/Button.svelte";
	import { page } from "$app/stores";
	import type { Promiseable } from "$lib/utils/type-utils";
	import type { Entry, Tag } from "@prisma/client";
	import Checkbox from "./ui/Checkbox.svelte";
	// import { enhance } from "$app/forms";
	import type { Validation } from "sveltekit-superforms";
	import type { TagSchema } from "$lib/features/entries/forms";
	import { superForm } from "sveltekit-superforms/client";
	import { cn } from "$lib/utils/tailwind";
	import { tick } from "svelte";
	import Badge from "./ui/Badge.svelte";

	export let tags: Promiseable<{id: string; name: string;}[]> =
		$page.data.user_data?.tags ?? [];

	export let entry: Pick<Entry, "id"> & {
		tags?: {
			id: number;
			name: string;
		}[];
	};

	export let data: Validation<TagSchema>;

	const { form, enhance } = superForm(data, {
		dataType: "json",
		onSubmit: (data) => {
			console.log("submit", data);
		},
	});

	export let action_prefix = `/tests/entry/${entry.id}`;

	let value = "";

	let formEl: HTMLFormElement;

	function sortTags(tags: { id: string | number; name: string }[]) {
		return tags.sort((a, b) => {
			const onEntry = entry.tags?.find((tag) => tag.id === a.id);
			const onEntry2 = entry.tags?.find((tag) => tag.id === b.id);
			if (onEntry && !onEntry2) return -1;
			if (!onEntry && onEntry2) return 1;
			return a.name.localeCompare(b.name);
		});
	}
</script>

<form
	class="flex max-w-xs flex-wrap items-center space-x-2"
	bind:this={formEl}
	use:enhance
	method="post"
	action="{action_prefix}?/tag"
>
	<!-- <p class="text-sm text-slate-500 dark:text-slate-400">Status</p> -->
	{#each entry.tags ?? [] as tag, i}
		<!-- {#each $form.tags as tag, i} -->
		<Badge variant="outline" as="a" href="/tests/tag/{tag.name}">
			{tag.name}
		</Badge>
	{/each}
	<Popover let:close>
		<PopoverTrigger
			class={cn(
				buttonVariants({
					variant: "outline",
				}),
				"w-[100px]"
			)}
		>
			Add tag
		</PopoverTrigger>
		<PopoverContent
		placement="left"
			class="p-0"
			on:open={(e) => {
				value = "";
				if (!e.detail.open)
					tick().then(() => {
						// test for equality
						if (
							JSON.stringify($form.tags) === JSON.stringify(entry.tags ?? [])
						) {
							console.log("no change");
						} else {
							console.log("change");
							formEl?.requestSubmit();
						}
					});
			}}
		>
			<Command
				filter={(val, search) => {
					return Number(val.toLowerCase().includes(search.toLowerCase()));
				}}
				multiple
				on:add={async ({ detail }) => {
					console.log("select", detail);
					const tag = (await tags).find((t) => t.name === detail.value);
					if (tag) {
						$form.tags = [...$form.tags, tag];
					} else {
						console.warn("tag not found", detail.value);
					}
				}}
				on:remove={async ({ detail }) => {
					console.log("remove", detail);
					$form.tags = $form.tags.filter((t) => t.name !== detail.value);
				}}
				on:close={() => {
					close(null);
					value = "";
				}}
				selected={$form.tags.map((tag) => tag.name)}
			>
				<CommandInput bind:value placeholder="Add tags..." />
				<CommandList class="scrollbar-none">
					<CommandEmpty class="px-2 py-3">
						<button
							on:click={() => {
								close(null);
								value = "";
							}}
							formaction="{action_prefix}?/createTag&name={value}"
							class="relative flex w-full cursor-default select-none items-center rounded-md bg-gray-100 px-2 py-1.5 text-sm font-medium outline-none dark:bg-gray-700"
							>Create new tag: {value}</button
						>
					</CommandEmpty>
					<CommandGroup>
						{#await tags}
							loading...
							<!-- TODO: sort tags to top if selected -->
						{:then tags}
							{@const sortedTags = sortTags(tags)}
							{#each sortedTags as tag (tag.id)}
								<CommandItem class="flex gap-4" let:selected>
									<Checkbox checked={selected} />
									<span>{tag.name}</span>
								</CommandItem>
							{/each}
						{/await}
					</CommandGroup>
				</CommandList>
			</Command>
		</PopoverContent>
	</Popover>
</form>
