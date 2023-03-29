<script lang="ts">
	import Button from "$lib/components/ui/Button.svelte";
	import Checkbox from "$lib/components/ui/Checkbox.svelte";
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle,
	} from "$lib/components/ui/dialog";
	import Input from "$lib/components/ui/Input.svelte";
	import Label from "$lib/components/ui/Label.svelte";
	import Switch from "$lib/components/ui/Switch.svelte";
	import { H1, Lead } from "$lib/components/ui/typography";
</script>

<div
	class="container flex h-full flex-col items-center justify-center space-y-10 p-10 text-white"
>
	<H1>Playground</H1>
	<Lead>A place to play with some UI components. Inspired by shadcn.</Lead>
	<Checkbox />

	<div class="flex w-full max-w-sm items-center space-x-2">
		<Label for="email">Email</Label>
		<Input id="email" type="email" placeholder="Email" />
		<Button type="submit">Subscribe</Button>
	</div>
	<Input type="email" placeholder="Email" disabled />

	<Switch />

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
</div>
