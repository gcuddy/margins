<script lang="ts" context="module">
	import { Button, type Props } from '.';
	import type { Meta } from '@storybook/svelte';
	export const meta: Meta = {
		title: 'Button',
        component: Button
	};
</script>

<script lang="ts">
	import { Story, Template } from '@storybook/addon-svelte-csf';
	let count = 0;
	function handleClick() {
		count += 1;
	}

    let defaultProps = {};
    let outlineProps: Props = { variant: 'outline' };
    let secondaryProps: Props = { variant: 'secondary' };
    let ghostProps: Props = { variant: 'ghost' };
    let linkProps: Props = { variant: 'link' };

</script>

<Template let:args>
	<!--👇 'on:click' allows to forward event to addon-actions  -->
	<Button {...args} on:click on:click={handleClick}>
		You clicked: {count}
	</Button>
</Template>

<Story name="Default" args={defaultProps} />
<Story name="Outline" args={outlineProps} />
<Story name="Secondary" args={secondaryProps} />
<Story name="Ghost" args={ghostProps} />
<Story name="Link" args={linkProps} />
