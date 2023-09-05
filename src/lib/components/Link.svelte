<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type $$Props = HTMLAnchorAttributes & {
        text?: string;
    }

	export let href: $$Props['href'] = '';

    export let text = '';
</script>

<a {href}>
	<slot>
        {text}
    </slot>
</a>
