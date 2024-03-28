import { render, screen } from '@testing-library/svelte';

import { Button } from './index.js';

describe('Tests for Button Component', () => {
	const label = 'Button';
	test('should render without errors', () => {
		render(Button);
		expect(screen.getByText('Button')).toBeInTheDocument();
	});
	test('href should render link', () => {
		render(Button, {
			href: 'https://www.google.com',
		});
		const badge = screen.getByText(label);
		expect(badge.tagName).toBe('A');
	});
});
