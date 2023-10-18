<script lang="ts">
	import { Button }  from '$components/ui/button';
	import Input from '$components/ui/input/input.svelte';
	import Label from '$components/ui/Label.svelte';
	import { createAvatar, melt } from '@melt-ui/svelte';
	import * as Card from '$components/ui/card';
	import * as Collapsible from '$components/ui/collapsible';
	import InviteCode from './invite-code.svelte';

	export let data;

	const {
		elements: { fallback, image },
	} = createAvatar({
		src: data.user.avatar ?? '',
	});
</script>

<form enctype="multipart/form-data" method="post">
	<!-- Profile Pic -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Edit profile</Card.Title>
		</Card.Header>
		<Card.Content>
			<Label for="profile-pic">Profile Picture</Label>
			<div class="flex gap-6 items-center">
				<div
					class="inline-flex overflow-hidden rounded-full square-24 relative shrink-0"
				>
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
						{data.user.username[0]?.toUpperCase()}
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
			<Input
				disabled
				name="username"
				id="username"
				type="text"
				value={data.user.username}
			/>

			<Label for="email">Email</Label>
			<Input
				name="email"
				id="email"
				disabled
				type="email"
				value={data.user.email}
			/>
		</Card.Content>
		<Card.Footer>
			<Button type="submit">Save</Button>
		</Card.Footer>
	</Card.Root>
</form>

<Card.Root>
	<Card.Header>
		<Card.Title>Invitation codes</Card.Title>
		<Card.Description>
			Send an invitation code to a friend to invite them to use Margins.
		</Card.Description>
	</Card.Header>
	<Card.Content class="space-y-4">
		<span>You have {data.invites.length} invitation code{data.invites.length > 1 ? 's' : ''} left.
		Share this link with a friend to share Margins with them:</span>

		{#if data.invites.length > 0}
			<Collapsible.Root class="space-y-2">
				{#each data.invites.slice(0, 1) as invite}
						<InviteCode code={invite.code} />
				{/each}
				<Collapsible.Content class="space-y-2">
					{#each data.invites.slice(1) as invite}
						<InviteCode code={invite.code} />
					{/each}
				</Collapsible.Content>
				{#if data.invites.length > 1}
					<Collapsible.Trigger>
						<Button variant="secondary">Show all</Button>
					</Collapsible.Trigger>
				{/if}
			</Collapsible.Root>
		{/if}
	</Card.Content>
</Card.Root>
