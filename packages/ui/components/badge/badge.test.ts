import { render, screen } from '@testing-library/svelte';

import Badge from './badge.test.svelte';

import Star from 'lucide-svelte/icons/star';

describe('Badge Component', () => {
	const label = 'Test Badge';
	test('should render without errors', () => {
		render(Badge, { label });
		expect(screen.getByText(label)).toBeInTheDocument();
	});
	test('href should render link', () => {
		render(Badge, {
			href: 'https://www.google.com',
			label,
		});
		const badge = screen.getByText(label);
		expect(badge.tagName).toBe('A');
	});
	test("Should render WithDot if the prop is true and shouldn't render if is false", async () => {
		const { rerender } = render(Badge, {
			withDot: true,
		});
		expect(screen.getByTestId('badge-dot')).toBeInTheDocument();

		await rerender({
			withDot: false,
		});

		expect(screen.queryByTestId('badge-dot')).not.toBeInTheDocument();
	});

	test('should render start icon if provided', () => {
		render(Badge, {
			label,
			startIcon: Star,
		});
		expect(screen.getByTestId('badge-icon')).toBeInTheDocument();
	});
});
