<script lang="ts">
	export let labelWrapper: HTMLLabelElement;
	export let hex: string;
	export let label: string;
	/* svelte-ignore unused-export-let */
	export let isOpen: boolean;
</script>

<label bind:this={labelWrapper}>
	<div>
		<input
			type="color"
			value={hex}
			on:click|preventDefault={() => {
				/**/
			}}
			aria-haspopup="dialog"
		/>
	</div>
	<span class="sr-only">{label}</span>
</label>

<style lang="postcss">
	label {
		display: flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
		border-radius: 3px;
		margin: 4px;
	}

	div {
		display: block;
		width: 20px;
		height: 20px;
		overflow: hidden;
		border-radius: 9999px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	input {
		margin: 0;
		padding: 0;
		border: none;
		width: 20px;
		height: 20px;
		flex-shrink: 0;
		cursor: pointer;
	}
	input::-webkit-color-swatch-wrapper {
		@apply rounded-full border-none p-0;
	}
	input::-webkit-color-swatch {
		@apply rounded-full border-none p-0;
	}

	:global(.has-been-tabbed) label:focus-within {
		outline: 2px solid var(--focus-color, red);
		outline-offset: 2px;
	}
</style>
