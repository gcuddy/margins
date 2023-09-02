<script lang="ts">
	import Button, { buttonVariants } from "$lib/components/ui/Button.svelte";
	import Checkbox from "$lib/components/ui/Checkbox.svelte";
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle,
	} from "$lib/components/ui/dialog";
	import {
		Tabs,
		TabsList,
		TabsTrigger,
		TabsContent,
	} from "$lib/components/ui/tabs";
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuSeparator,
		DropdownMenuItem,
		DropdownMenuTrigger,
	} from "$lib/components/ui/dropdown-menu";
	import Input from "$lib/components/ui/input/input.svelte";
	import Label from "$lib/components/ui/Label.svelte";
	import Separator from "$lib/components/ui/Separator.svelte";
	import Switch from "$lib/components/ui/Switch.svelte";
	import { H1, H2, Lead } from "$lib/components/ui/typography";
	import toast from "svelte-french-toast";
	import {
		Popover,
		PopoverContent,
		PopoverTrigger,
	} from "$lib/components/ui/popover";
	import { Settings2 } from "lucide-svelte";
	import { cn } from "$lib/utils/tailwind";
</script>

<div
	class="container flex h-full flex-col items-center justify-center space-y-10 p-10 dark:bg-slate-900"
>
	<H1>Playground</H1>
	<Lead>A place to play with some UI components. Inspired by shadcn.</Lead>
	<Checkbox class="transition active:scale-105" />

	<div class="flex w-full max-w-sm items-center space-x-2">
		<Label for="email">Email</Label>
		<Input id="email" type="email" placeholder="Email" />
		<Button type="submit">Subscribe</Button>
	</div>
	<Input type="email" placeholder="Email" disabled />

	<Switch />

	<DropdownMenu>
		<DropdownMenuTrigger>
			<Button>My account</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent>
			<div>My account</div>
			<DropdownMenuSeparator />
			<DropdownMenuItem>Profile</DropdownMenuItem>
			<DropdownMenuItem>Billing</DropdownMenuItem>
			<DropdownMenuItem>Team</DropdownMenuItem>
			<DropdownMenuItem>Subscription</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>

	<Dialog>
		<svelte:fragment slot="trigger">
			<Button variant="outline">Edit profile</Button>
		</svelte:fragment>
		<DialogContent class="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Edit profile</DialogTitle>
				<DialogDescription>
					Make changes to your profile here. Click save when you're done.
				</DialogDescription>
			</DialogHeader>
			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="name" class="text-right">Name</Label>
					<Input id="name" value="Pedro Duarte" class="col-span-3" />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="username" class="text-right">Username</Label>
					<Input id="username" value="@peduarte" class="col-span-3" />
				</div>
			</div>
			<DialogFooter>
				<Button type="submit">Save changes</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>

	<Separator />
	<H2>Tabs</H2>
	<Tabs class="w-[400px]">
		<TabsList>
			<TabsTrigger>Account</TabsTrigger>
			<TabsTrigger>Password</TabsTrigger>
		</TabsList>
		<TabsContent>
			<p class="text-sm text-slate-500 dark:text-slate-400">
				Make changes to your account here. Click save when you're done.
			</p>
			<div class="grid gap-2 py-4">
				<div class="space-y-1">
					<Label for="name">Name</Label>
					<Input id="name" value="Pedro Duarte" />
				</div>
				<div class="space-y-1">
					<Label for="username">Username</Label>
					<Input id="username" value="@peduarte" />
				</div>
			</div>
			<div class="flex">
				<Button>Save changes</Button>
			</div>
		</TabsContent>
		<TabsContent>
			<p class="text-sm text-slate-500 dark:text-slate-400">
				Change your password here. After saving, you'll be logged out.
			</p>
			<div class="grid gap-2 py-4">
				<div class="space-y-1">
					<Label for="current">Current password</Label>
					<Input id="current" type="password" />
				</div>
				<div class="space-y-1">
					<Label for="new">New password</Label>
					<Input id="new" type="password" />
				</div>
			</div>
			<div class="flex">
				<Button>Save password</Button>
			</div>
		</TabsContent>
	</Tabs>

	<Button
		on:click={() => {
			toast("Toast");
		}}>Toast</Button
	>

	<H2>Popover</H2>

	<Popover>
		<PopoverTrigger
			as="button"
			class={cn(
				buttonVariants({
					variant: "outline",
					size: "default",
				}),
				"w-10 rounded-full p-0"
			)}
		>
			<Settings2 class="h-4 w-4" />
			<span class="sr-only">Open popover</span>
		</PopoverTrigger>
		<PopoverContent class="w-80">
			<div class="grid gap-4">
				<div class="space-y-2">
					<h4 class="font-medium leading-none">Dimensions</h4>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						Set the dimensions for the layer.
					</p>
				</div>
				<div class="grid gap-2">
					<div class="grid grid-cols-3 items-center gap-4">
						<Label for="width">Width</Label>
						<Input id="width" value="100%" class="col-span-2 h-8" />
					</div>
					<div class="grid grid-cols-3 items-center gap-4">
						<Label for="maxWidth">Max. width</Label>
						<Input id="maxWidth" value="300px" class="col-span-2 h-8" />
					</div>
					<div class="grid grid-cols-3 items-center gap-4">
						<Label for="height">Height</Label>
						<Input id="height" value="25px" class="col-span-2 h-8" />
					</div>
					<div class="grid grid-cols-3 items-center gap-4">
						<Label for="maxHeight">Max. height</Label>
						<Input id="maxHeight" value="none" class="col-span-2 h-8" />
					</div>
				</div>
			</div>
		</PopoverContent>
	</Popover>
</div>
