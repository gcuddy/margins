<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { Button } from '../button/index.js';
	import type { ComponentProps } from 'svelte';

	type $$Props = DialogPrimitive.CloseProps & {
		onClick?: (e: MouseEvent) => void;
		variant?: ComponentProps<Button>['variant'];
	};

	export let variant: $$Props['variant'] = 'outline';
	export let onClick: $$Props['onClick'] = undefined;
</script>

<DialogPrimitive.Close>
	<Button on:click={onClick} data-testid="dialog-close" {variant}>
		<slot>Close</slot>
	</Button>
</DialogPrimitive.Close>
