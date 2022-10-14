<script>
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import GenericInput from '$lib/components/GenericInput.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
</script>

<form class="space-y-2 px-10 pt-[10vh] text-lg" use:enhance>
	<div class="container mx-auto flex flex-col gap-4">
		<label for="url">Enter a URL to subscribe to:</label>
		<GenericInput
			type="text"
			variant="underline"
			name="url"
			placeholder="https://example.com/feed.xml"
			class="text-xl text-amber-900 dark:text-amber-50"
		/>
		<Button type="submit" size="lg" className="place-self-end space-x-2" scaleOnHover={true}
			><span>Submit</span> <Icon name="arrowSmRightSolid" /></Button
		>
	</div>
	<!-- <div class="flex gap-3">
        <label for="title">Title</label><input name="title" type="text" value={title} />
    </div> -->
	<!-- <div class="flex gap-3">
        <label for="description">Description</label><textarea
            name="description"
            id="description"
            cols="30"
            rows="10"
            value={description}
        />
    </div>
    <div class="flex gap-3"><label for="Tags">Tags</label><input type="text" name="tags" /></div> -->
	<!-- if we're submitting a bookmark, this matters below — not sure if this should be for both read-later and bookmarks, tho -->
</form>
