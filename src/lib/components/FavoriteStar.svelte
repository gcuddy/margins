<script lang="ts">
	import { invalidate } from '$app/navigation';

	import type { FavoriteSchema } from '$lib/types/schemas/Favorite';

	import { createFavorite, deleteFavorite } from '$lib/utils';
	import type { z } from 'zod';
	import Icon from './helpers/Icon.svelte';

	export let starred: boolean;
	// oh. no. i'm doing this because of the page.stuff.currentFeed store which is not fun to work with. but really i should update it.
	let _starred = starred;
	export let data: z.infer<typeof FavoriteSchema>;
	export let favorite_id: number | undefined = undefined;
	let pending = false;
</script>

<button
	class="flex items-center rounded-full ring-offset-2 focus:ring"
	on:click={async () => {
		_starred = !_starred;
		// send to favorite store, and update
		if (_starred) {
			pending = true;
			const res = await createFavorite(data);
			pending = false;
			const { id } = await res.json();
			favorite_id = id;
		} else if (!_starred) {
			if (favorite_id) {
				await deleteFavorite({ id: favorite_id });
				favorite_id = undefined;
			}
		}
		await invalidate('/api/favorites.json');
	}}
>
	<Icon
		name="starSolid"
		className="h-4 w-4 {_starred
			? 'fill-amber-400 stroke-1 stroke-amber-400'
			: 'stroke-1 stroke-current fill-transparent'}"
	/></button
>
