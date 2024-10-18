const plugin = require('tailwindcss/plugin');

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
      borderWidth: {
        DEFAULT: '0.5px',
        1: '1px'
      },
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
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        4.5: '20px',
        5: '24px',
        6: '32px',
        7: '40px',
        8: '48px',
        9: '64px'
      },
      // TODO: css styilng of links
      typography: () => ({
        DEFAULT: {
          css: {
            a: {
              color: 'var(--tw-prose-links)',
              textDecorationLine: 'none',
              textDecorationStyle: 'solid',
              fontWeight: '400',
              textDecorationThickness: 'min(2px, max(1px, 0.05em))',
              textUnderlineOffset: 'calc(0.025em + 2px)',
              textDecorationColor: 'var(--tw-prose-link-decoration-color)',
              '&:hover': {
                textDecorationLine: 'underline'
              }
              // idk how to do mixin?
            }
          }
        },
        gray: {
          css: {
            '--tw-prose-body': 'var(--gray-12)',
            '--tw-prose-headings': 'var(--gray-12)',
            '--tw-prose-lead': 'var(--gray-11)',
            '--tw-prose-links': 'var(--accent-a11)',
            '--tw-prose-link-decoration-color': 'var(--link-text-decoration-color)',
            '--tw-prose-bold': 'var(--gray-12)',
            '--tw-prose-counters': 'var(--gray-10)',
            '--tw-prose-bullets': 'var(--gray-a6)',
            '--tw-prose-hr': 'var(--gray-a6)',
            '--tw-prose-quotes': 'var(--gray-12)',
            '--tw-prose-quote-borders': 'var(--accent-a6)',
            '--tw-prose-captions': 'var(--gray-11)',
            '--tw-prose-kbd': 'var(--gray-12)',
            '--tw-prose-kbd-shadows': 'var(--gray-12)',
            '--tw-prose-code': 'var(--accent-a11)',
            '--tw-prose-pre-code': 'var(--accent-a11)',
            '--tw-prose-pre-bg': 'var(--accent-a3)',
            '--tw-prose-th-borders': 'var(--gray-a6)',
            '--tw-prose-td-borders': 'var(--gray-a6)'
          }
        }
      })
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    plugin(function ({ addVariant }) {
      addVariant('high-contrast', '&:where(.high-contrast)');
      addVariant('accent-color', '&:where([data-accent-color])');
    })
  ]
};
