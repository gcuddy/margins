<script lang="ts">
	import { Badge } from '$components/ui/badge';
	import { TagColorPill } from './tag-color';

	export let tag: {
		name: string;
		color: string;
		id?: number;
	};
</script>

<Badge as="a" href="/tag/{tag.name}" variant="outline">
	<TagColorPill class="mr-1.5 h-2 w-2" color={tag.color ?? '#000000'} />
	{tag.name}</Badge
>
