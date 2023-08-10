<script lang="ts">
	import Button from '$components/ui/Button.svelte';
	import Input from '$components/ui/Input.svelte';
	import Label from '$components/ui/Label.svelte';
	import { createAvatar, melt } from '@melt-ui/svelte';

	export let data;

	const {
		elements: { fallback, image }
	} = createAvatar({
		src: data.user.avatar ?? ''
	});
</script>

<form enctype="multipart/form-data" method="post" class="flex flex-col gap-y-4">
	<!-- Profile Pic -->
	<Label for="profile-pic">Profile Picture</Label>
	<div class="flex gap-6 items-center">
		<div class="inline-flex overflow-hidden rounded-full square-24 relative shrink-0">
			<img
				class="w-full h-full aspect-square"
				use:melt={$image}
				src={data.user.avatar}
				alt="Avatar for @{data.user.username}"
			/>
			<span
				use:melt={$fallback}
				class="flex h-full w-full items-center justify-center rounded-full bg-muted text-xl"
			>
				<!-- get initial from username -->
				{data.user.username[0].toUpperCase()}
			</span>
		</div>
		<Input
			name="avatar"
			accept="image/png, image/jpeg"
			class="w-min"
			id="profile-pic"
			type="file"
		/>
	</div>
	<Label for="username">Username</Label>
	<Input disabled name="username" id="username" type="text" value={data.user.username} />

	<Label for="email">Email</Label>
	<Input name="email" id="email" disabled type="email" value={data.user.email} />

	<Button type="submit">Save</Button>
</form>
