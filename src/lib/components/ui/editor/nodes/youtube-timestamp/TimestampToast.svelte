<script lang='ts'>
	import toast_, { ToastOptions } from 'svelte-french-toast';

	export let toast: ToastOptions;

	// Use this component in your app:
	// toast(RichContent)
</script>

<span>
	Custom and <b>bold</b>
	<button on:click={() => toast_.dismiss(toast.id)}>Dismiss</button>
</span>