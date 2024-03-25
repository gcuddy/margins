import React from 'react';

export function ColorProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = React.useState('light');
	return (
		<div>
			<div className="flex justify-end gap-2 pb-2 text-sm">
				<label className="flex gap-1">
					Light
					<input
						type="radio"
						name="theme"
						value="light"
						checked={theme === 'light'}
						onChange={() => setTheme('light')}
					/>
				</label>
				<label className="flex gap-1">
					Dark
					<input
						type="radio"
						name="theme"
						value="dark"
						checked={theme === 'dark'}
						onChange={() => setTheme('dark')}
					/>
				</label>
			</div>
			<div data-theme={theme}>{children}</div>
		</div>
	);
}
