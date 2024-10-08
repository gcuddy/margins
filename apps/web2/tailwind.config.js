/**
 * Given a radix color, generates tailwind colors for css variables.
 * @template {string} T
 * @param {T} color
 * @returns {Record<`${number}` | `${number}a`, string>}
 */
function makeRadixColors(color) {
	const output = {};
	for (let i = 1; i <= 12; i++) {
		output[`${i}`] = `var(--${color}-${i})`;
		output[`${i}a`] = `var(--${color}-a${i})`;
	}
	console.log('radix output', output);
	return output;
}

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			borderRadius: {
				1: '4.5px',
				2: '6px',
				3: '9px',
				4: '12px',
				5: '18px',
				6: '24px'
			},
			fontFamily: {
				default: [
					'InterVar',
					"-apple-system, BlinkMacSystemFont, 'Segoe UI (Custom)', Roboto, 'Helvetica Neue', 'Open Sans (Custom)', system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'"
				],
				code: "'Menlo', 'Consolas (Custom)', 'Bitstream Vera Sans Mono', monospace, 'Apple Color Emoji', 'Segoe UI Emoji'",
				emphasis: "'Times New Roman', 'Times', serif",
				quote: "'Times New Roman', 'Times', serif"
			},
			fontSize: {
				1: ['12px', { lineHeight: '16px', letterSpacing: '0.0025em' }],
				2: ['14px', { lineHeight: '20px', letterSpacing: '0em' }],
				3: ['16px', { lineHeight: '24px', letterSpacing: '0em' }],
				4: ['18px', { lineHeight: '26px', letterSpacing: '-0.0025em' }],
				5: ['20px', { lineHeight: '28px', letterSpacing: '-0.005em' }],
				6: ['24px', { lineHeight: '30px', letterSpacing: '-0.00625em' }],
				7: ['28px', { lineHeight: '36px', letterSpacing: '-0.0075em' }],
				8: ['35px', { lineHeight: '40px', letterSpacing: '-0.01em' }],
				9: ['60px', { lineHeight: '60px', letterSpacing: '-0.025em' }]
			},
			colors: {
				orange: makeRadixColors('orange'),
				gray: makeRadixColors('gray'),
				focus: makeRadixColors('focus'),
				accent: makeRadixColors('accent')
			}
		}
	},
	plugins: []
};
