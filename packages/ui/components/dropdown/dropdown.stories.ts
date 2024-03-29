import type { Meta, StoryObj } from '@storybook/svelte';

import Dropdown from './dropdown.test.svelte';


const meta = {
	component: Dropdown,
	tags: ['autodocs'],
	title: 'UI/Dropdown',
} satisfies Meta<Dropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	argTypes: {},
	args: {},
	name: 'Default',
};
