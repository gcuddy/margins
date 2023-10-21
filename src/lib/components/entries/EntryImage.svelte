<script lang="ts">
	import { cn } from '$lib/utils/tailwind';
	import type { Maybe } from '$lib/utils/type-utils';
	import { createAvatar, melt } from '@melt-ui/svelte';
	import type { DocumentType } from '@prisma/client';
	import EntryIcon from './EntryIcon.svelte';

	let src: Maybe<string>;
	export { src as image };

	export let type: DocumentType;

	const {
		elements: { image, fallback }
	} = createAvatar({
		src: src ?? ''
	});

	let className = '';
	export { className as class };
</script>

<div
	class={cn(
		'relative h-16 w-16 shrink-0 overflow-hidden rounded-md object-cover flex items-center justify-center bg-neutral-100',
		className
	)}
>
	<img use:melt={$image} alt="Avatar" class="h-full w-full rounded-[inherit]" />
	<span use:melt={$fallback}>
		<EntryIcon {type} />
	</span>
</div>
