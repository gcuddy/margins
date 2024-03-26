<script lang="ts">
	import { invalidate } from '$app/navigation';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle
	} from '$lib/components/ui/dialog';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';
	import Button, { buttonVariants } from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Kbd from '$lib/components/ui/KBD.svelte';
	import Label from '$lib/components/ui/Label.svelte';
	import { Plus } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { urlSchema } from '$lib/schemas';

	const queryClient = useQueryClient();

	export let urlForm: SuperValidated<typeof urlSchema>;

	const { enhance: enhance_add_url } = superForm(urlForm, {
		invalidateAll: false,
		onSubmit: () => {
			add_url_promise = new Promise((resolve) => {
				resolve_add_url_promise = resolve;
			});
			toast.promise(add_url_promise, {
				loading: 'Adding URL...',
				success: 'URL added!',
				error: 'Failed to add URL.'
			});
		},
		onResult: async () => {
			console.log('HELLLOOOOO');
			url_modal = false;
			resolve_add_url_promise({});
			console.log({ add_url_promise });
			invalidate('entries');
			queryClient.invalidateQueries({
				queryKey: ['entries']
			});
		},
		taintedMessage: null
	});

	let add_url_promise: Promise<any> | null = null;
	let resolve_add_url_promise: (value: any) => void;
	let url_modal = false;
</script>

<div class="fixed bottom-4 left-4 flex items-center justify-between">
	<div class="flex items-center gap-x-2">
		<Dialog bind:isOpen={url_modal}>
			<svelte:fragment slot="trigger">
				<form on:submit|preventDefault action="/library/add">
					<Button size="sm" class="relative">
						<Plus class="mr-2 h-4 w-4" />
						<span class="sr-only">Add URL</span>
					</Button>
				</form>
			</svelte:fragment>
			<DialogContent>
				<form action="/s?/addUrl" method="post" use:enhance_add_url>
					<DialogHeader>
						<DialogTitle>Add URL</DialogTitle>
						<DialogDescription>Copy and paste the URL or ISBN to add.</DialogDescription>
					</DialogHeader>
					<div class="grid gap-4 py-4">
						<div class="grid gap-2">
							<Label for="url">URL or ISBN</Label>
							<Input
								name="url"
								id="url"
								placeholder="https://example.com/article, 0801856736, etc."
							/>
						</div>
					</div>
					<DialogFooter>
						<Button>Save</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	</div>
</div>
