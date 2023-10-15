<script lang="ts">
	import Label from '$components/ui/Label.svelte';
	import Input from '$components/ui/input/input.svelte';
	import Dialog from '$components/ui/dialog2/Dialog.svelte';
	import { enhance } from '$app/forms';
	import Button from '$components/ui/Button.svelte';
	import { toast } from 'svelte-sonner';
	import { createEventDispatcher } from 'svelte';
	import { useQueryClient } from '@tanstack/svelte-query';

	let addUrlPromise: Promise<any> | null = null;
	let resolveAddUrlPromise: (value: any) => void;

	const dispatch = createEventDispatcher();

	const queryClient = useQueryClient();

    let pending = false;
</script>

<form
	action="/s?/addUrl"
	method="post"
	use:enhance={({}) => {
        pending = true;
		addUrlPromise = new Promise((resolve) => {
			resolveAddUrlPromise = resolve;
		});

        dispatch('submit');

		toast.promise(addUrlPromise, {
			loading: 'Adding URL...',
			success: 'URL added!',
			error: 'Failed to add URL.'
		});

		return async (e) => {
			dispatch('done', e);
            pending = false;
			resolveAddUrlPromise({});
			await queryClient.invalidateQueries({
				queryKey: ['entries']
			});
			await e.update();
		};
	}}
>
	<div class="grid gap-4 py-4">
		<div class="grid gap-2">
			<Label for="url">URL</Label>
			<Input name="url" id="url" placeholder="https://example.com/article" />
		</div>
	</div>
	<slot {pending} name="footer">
		<Button disabled={pending} type="submit">Save</Button>
	</slot>
</form>
