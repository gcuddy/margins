<script lang="ts">
	import { Dialog as DialogPrimitives } from 'bits-ui';

	type $$Props = DialogPrimitives.CloseProps;
</script>

<DialogPrimitives.Close {...$$restProps} asChild let:builder on:click>
	<slot {builder} />
</DialogPrimitives.Close>
