<script lang="ts">
	import { cn } from '$lib/utils';
	import { createAvatar, melt } from '@melt-ui/svelte';

	export let user: {
		avatar?: string | null;
		username: string;
	};

	const {
		elements: { fallback, image }
	} = createAvatar({
		src: user.avatar ?? ''
	});

    let className = '';
    export { className as class};
</script>

<span class={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}>
	<img use:melt={$image} alt="avatar" class="aspect-square h-full w-full" />
	<span
		use:melt={$fallback}
		class="flex h-full w-full items-center justify-center rounded-full bg-muted"
	>
		{user.username.at(0)?.toUpperCase()}
	</span>
</span>
