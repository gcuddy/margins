<script lang="ts">
	import { signOut, getSession } from 'lucia-sveltekit/client';

	const signOutUser = async () => {
		await signOut();
		window.location.href = '/';
	};
</script>

<button on:click={signOutUser}>SIGN OUT</button>

<slot />
