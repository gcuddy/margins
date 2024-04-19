<script lang="ts">
	import '@margins/ui/styles/style.css';
	import { Button } from '@margins/ui';
	export let sessionID = '';
</script>

<div class=" flex min-w-[20rem] flex-col gap-4 bg-blue-50 p-4">
	hello
	{#if sessionID}
		session ID: {sessionID}
	{:else}
		no session ID
		<Button>log in hehe</Button>
	{/if}
</div>
