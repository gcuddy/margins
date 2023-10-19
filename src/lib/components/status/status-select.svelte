<script lang="ts">
	// TODO
	// export let native = false;
	export let status: Status;

	type $$Props =
		| {
				// TODO: stricter types
				status: Status;
				type: string;
				id: string | number;
				entryId?: never;
		  }
		| {
				status: Status;
				entryId: number;
				type?: never;
				id?: never;
		  };

	export let entryId: $$Props['entryId'] = undefined;
	export let type: $$Props['type'] = undefined;
	export let id: $$Props['id'] = undefined;

	$: action = entryId ? `/entry/${entryId}/` : `/${type}/${id}/`;

	import * as Select from '$components/ui/select';
	import { objectEntries } from '$lib/helpers';
	import {
		statusesToDisplay,
		type Status,
		getStatusIcon,
		isStatus,
	} from '$lib/status';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import type { statusUpdateSchema } from './schema';
	import { tick } from 'svelte';
	import { invalidateEntries } from '$lib/queries/mutations';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { buttonVariants } from '$components/ui/button';
	const frm: SuperValidated<typeof statusUpdateSchema> = {
		constraints: {},
		data: {
			status,
		},
		errors: {},
		posted: false,
		valid: true,
	};
	const queryClient = useQueryClient();
	const { form, enhance } = superForm(frm, {
		invalidateAll: false,
		onResult({ result }) {
			// invalidate entries
			console.log('updated');
			if (result.type === 'success') {
				invalidateEntries(queryClient);
			}
		},
	});

	$: if (status !== undefined) {
		$form.status = status;
	}

	let formEl: HTMLFormElement;
</script>

<form
	bind:this={formEl}
	use:enhance
	method="post"
	action="{action}?/updateStatus"
>
	{#if $form}
		<input type="hidden" name="status" value={$form.status} />
	{/if}
	<Select.Root
		selected={{
			value: status,
			label: status ? statusesToDisplay[status] : undefined,
		}}
		onSelectedChange={(val) => {
			if (val) {
				const { value } = val;
				if (isStatus(value)) {
					$form.status = value;
					tick().then(() => {
						formEl.requestSubmit();
					});
				}
			}
		}}
	>
		<Select.Trigger class="w-auto">
			<Select.Value placeholder="Status" asChild let:label>
				<span class="flex items-center gap-2 pr-2">
					<svelte:component this={getStatusIcon(label, true)} class="w-4 h-4 shrink-0 stroke-[1.5]" />
					{label}
				</span>
			</Select.Value>
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Status</Select.Label>
				{#each objectEntries(statusesToDisplay) as [value, label]}
					<Select.Item {value} {label}>
						<svelte:component
							this={getStatusIcon(value)}
							class="w-4 h-4 mr-2 shrink-0 stroke-[1.5]"
						/>
						{label}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
	<!-- <noscript>
		<select> </select>
		<button class={buttonVariants({ variant: 'outline' })} type="submit"
			>Update</button
		>
	</noscript> -->
</form>
