<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type $$Props = HTMLAnchorAttributes & {
        text?: string;
    }

	export let href: $$Props['href'] = '';

    export let text = '';
    let className: string | null | undefined = undefined
    export { className as class };
</script>

<a {href} class={className}>
	<slot>
        {text}
    </slot>
</a>
