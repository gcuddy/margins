import defaultTheme from "tailwindcss/defaultTheme"
import plugin from "tailwindcss/plugin"
import type { Config } from "tailwindcss"

import tailwindcssRadixColors from "tailwindcss-radix-colors"

// Plugins
import typography from "@tailwindcss/typography"
import gradientMaskImage from "tailwind-gradient-mask-image"
import scrollbar from "tailwind-scrollbar"
import scrollbarHide from "tailwind-scrollbar-hide"
import animate from "tailwindcss-animate"
import containerQueries from "@tailwindcss/container-queries"

import { sandA, sandDarkA, blackA } from "@radix-ui/colors"

const shadows = {
  5: `0 0 0 1px ${sandA.sandA3},0 12px 60px ${blackA.blackA3},0 12px 32px -16px ${sandA.sandA5}`,
  "5-dark": `0 0 0 1px ${sandDarkA.sandA6},0 12px 60px ${blackA.blackA5},0 12px 32px -16px ${blackA.blackA7}`,
  6: `0 0 0 1px ${sandA.sandA3},0 12px 60px ${blackA.blackA3},0 16px 64px ${sandA.sandA2},0 16px 36px -20px ${sandA.sandA7}`,
  "6-dark": `0 0 0 1px ${sandDarkA.sandA6},0 12px 60px ${blackA.blackA4},0 16px 64px ${blackA.blackA6},0 16px 36px -20px ${blackA.blackA11}`,
}
console.log({ shadows })

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./pages/**/*.{html,js,svelte,ts}",
    "./modules/**/*.{html,js,svelte,ts}",
    "./components/**/*.{html,js,svelte,ts}",
    "../../packages/ui/**/*.{html,js,svelte,ts,jsx,tsx}",
    "../../packages/features/**/*.{js,ts,jsx,tsx,html,svelte}",
  ],
  darkMode: ["selector", '[data-theme="dark"]'],
  future: {
    hoverOnlyWhenSupported: true,
    respectDefaultRingColorOpacity: true,
  },

  // ?
  plugins: [
    typography,
    gradientMaskImage,
    scrollbar({ nocompatible: true }),
    scrollbarHide,
    animate,
    containerQueries,
    tailwindcssRadixColors({
      disableSemantics: true,
    }),
    // custom modifiers
    plugin(({ addVariant, matchUtilities, theme }) => {
      addVariant("transparency", ['[data-transparency="true"] &'])
      addVariant("solid", ['[data-transparency="disabled"] &'])
      addVariant("hocus", ["&:hover", "&:focus"])
      addVariant("elevation", [".elevation &"])
      addVariant("mobile", [".mobile &"])
      // Square utility
      matchUtilities(
        {
          square: value => ({
            height: value,
            width: value,
          }),
        },
        { values: theme("spacing") },
      )
    }),
  ],
  theme: {
    container: {
      center: true,
      // padding: "2rem",
      screens: {
        "2xl": "1440px",
        "3xl": "1600px",
      },
    },
    fontSize: {
      xs: [
        ".75rem",
        {
          lineHeight: "1rem",
          letterSpacing: "0.0025em",
        },
      ],
      sm: [
        ".875rem",
        {
          lineHeight: "1.25rem",
          letterSpacing: "0em",
        },
      ],
      base: [
        "1rem",
        {
          lineHeight: "1.5rem",
          letterSpacing: "0em",
        },
      ],
      lg: [
        "1.125rem",
        {
          lineHeight: "1.625rem",
          letterSpacing: "-0.0025em",
        },
      ],
      xl: [
        "1.25rem",
        {
          lineHeight: "1.75rem",
          letterSpacing: "-0.005em",
        },
      ],
      "2xl": [
        "1.5rem", // 24px
        {
          lineHeight: "1.875rem", // 30px
          letterSpacing: "-0.00625em",
        },
      ],
      "3xl": [
        "1.75rem", // 28px
        {
          lineHeight: "2.25rem", // 36px
          letterSpacing: "-0.0075em",
        },
      ],
      "4xl": [
        "2.1875rem", // 35px
        {
          lineHeight: "2.5rem", // 40px
          letterSpacing: "-0.01em",
        },
      ],
      "5xl": [
        "3.75rem", // 60px
        {
          lineHeight: "3.75rem", // 60px
          letterSpacing: "-0.025em",
        },
      ],
    },
    extend: {
      animation: {
        flash: "flash 4s",
        marquee: "marquee 30s linear infinite",
        marquee2: "marquee2 30s linear infinite",
        "scale-1": "scale 1s ease-in-out",
        skeleton: "skeleton 1s infinite alternate-reverse",
      },

      backgroundColor: {
        base: "hsl(var(--color-base) / <alpha-value>)",
        "base-hover": "hsl(var(--color-base-hover) / <alpha-value>)",
        elevation: "hsl(var(--color-elevation) / <alpha-value>)",
        "elevation-hover": "hsl(var(--color-elevation-hover) / <alpha-value>)",
        skin: {
          "entry-bg": "var(--entry-bg-color)",
        },
      },
      // borderRadius: {
      // 	lg: `var(--radius)`,
      // 	md: `calc(var(--radius) - 2px)`,
      // 	sm: 'calc(var(--radius) - 4px)',
      // },
      boxShadow: {
        ...shadows,
        "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.4)",
        subtle:
          "rgba(0, 0, 0, 0.02) 0px 4px 4px -1px, rgba(0, 0, 0, 0.06) 0px 1px 1px 0px",
      },
      colors: {
        amber: {
          1: "var(--amber-1)",
          2: "var(--amber-2)",
          3: "var(--amber-3)",
          4: "var(--amber-4)",
          5: "var(--amber-5)",
          6: "var(--amber-6)",
          7: "var(--amber-7)",
          8: "var(--amber-8)",
          9: "var(--amber-9)",
          10: "var(--amber-10)",
          11: "var(--amber-11)",
          12: "var(--amber-12)",
          "1a": "var(--amber-1a)",
          "2a": "var(--amber-a2)",
          "3a": "var(--amber-a3)",
          "4a": "var(--amber-a4)",
          "5a": "var(--amber-a5)",
          "6a": "var(--amber-a6)",
          "7a": "var(--amber-a7)",
          "8a": "var(--amber-a8)",
          "9a": "var(--amber-a9)",
          "10a": "var(--amber-a10)",
          "11a": "var(--amber-a11)",
          "12a": "var(--amber-a12)",
        },
        amberA: {
          1: "var(--amber-a1)",
          2: "var(--amber-a2)",
          3: "var(--amber-a3)",
          4: "var(--amber-a4)",
          5: "var(--amber-a5)",
          6: "var(--amber-a6)",
          7: "var(--amber-a7)",
          8: "var(--amber-a8)",
          9: "var(--amber-a9)",
          10: "var(--amber-a10)",
          11: "var(--amber-a11)",
          12: "var(--amber-a12)",
        },
        accent: {
          1: "var(--accent-1)",
          2: "var(--accent-2)",
          3: "var(--accent-3)",
          4: "var(--accent-4)",
          5: "var(--accent-5)",
          6: "var(--accent-6)",
          7: "var(--accent-7)",
          8: "var(--accent-8)",
          9: "var(--accent-9)",
          10: "var(--accent-10)",
          11: "var(--accent-11)",
          12: "var(--accent-12)",
          contrast: "var(--accent-contrast)",
          surface: "var(--accent-surface)",
          indicator: "var(--accent-indicator)",
          track: "var(--accent-track)",
        },
        accentA: {
          1: "var(--accent-a1)",
          2: "var(--accent-a2)",
          3: "var(--accent-a3)",
          4: "var(--accent-a4)",
          5: "var(--accent-a5)",
          6: "var(--accent-a6)",
          7: "var(--accent-a7)",
          8: "var(--accent-a8)",
          9: "var(--accent-a9)",
          10: "var(--accent-a10)",
          11: "var(--accent-a11)",
          12: "var(--accent-a12)",
        },
        gray: {
          1: "var(--sand-1)",
          2: "var(--sand-2)",
          3: "var(--sand-3)",
          4: "var(--sand-4)",
          5: "var(--sand-5)",
          6: "var(--sand-6)",
          7: "var(--sand-7)",
          8: "var(--sand-8)",
          9: "var(--sand-9)",
          10: "var(--sand-10)",
          11: "var(--sand-11)",
          12: "var(--sand-12)",
        },
        grayA: {
          1: "var(--sand-a1)",
          2: "var(--sand-a2)",
          3: "var(--sand-a3)",
          4: "var(--sand-a4)",
          5: "var(--sand-a5)",
          6: "var(--sand-a6)",
          7: "var(--sand-a7)",
          8: "var(--sand-a8)",
          9: "var(--sand-a9)",
          10: "var(--sand-a10)",
          11: "var(--sand-a11)",
          12: "var(--sand-a12)",
        },
        sand: {
          1: "var(--sand-1)",
          2: "var(--sand-2)",
          3: "var(--sand-3)",
          4: "var(--sand-4)",
          5: "var(--sand-5)",
          6: "var(--sand-6)",
          7: "var(--sand-7)",
          8: "var(--sand-8)",
          9: "var(--sand-9)",
          10: "var(--sand-10)",
          11: "var(--sand-11)",
          12: "var(--sand-12)",
        },
        sandA: {
          1: "var(--sand-a1)",
          2: "var(--sand-a2)",
          3: "var(--sand-a3)",
          4: "var(--sand-a4)",
          5: "var(--sand-a5)",
          6: "var(--sand-a6)",
          7: "var(--sand-a7)",
          8: "var(--sand-a8)",
          9: "var(--sand-a9)",
          10: "var(--sand-a10)",
          11: "var(--sand-a11)",
          12: "var(--sand-a12)",
        },
      },
      // colors: {
      // 	accent: {
      // 		DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
      // 		foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
      // 	},
      // 	attention: {
      // 		DEFAULT: 'hsl(var(--attention) / <alpha-value>)',
      // 		foreground: 'hsl(var(--attention-foreground) / <alpha-value>)',
      // 	},
      // 	background: {
      // 		DEFAULT: 'hsl(var(--background) / <alpha-value>)',
      // 		elevation: 'hsl(var(--background-elevation) / <alpha-value>)',
      // 		elevation2: 'hsl(var(--background-elevation2) / <alpha-value>)',
      // 	},
      // 	border: 'hsl(var(--border) / <alpha-value>)',
      // 	card: {
      // 		DEFAULT: 'hsl(var(--card) / <alpha-value>)',
      // 		foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
      // 	},
      // 	destructive: {
      // 		DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
      // 		foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
      // 	},
      // 	foreground: 'hsl(var(--foreground) / <alpha-value>)',
      // 	glass: 'hsl(var(--glass) / <alpha-value>)',
      // 	highlight: {
      // 		pink: '#ff00b8',
      // 		yellow: '#ffd700',
      // 		'yellow-dark': '#ecc100',
      // 	},
      // 	input: 'hsl(var(--input) / <alpha-value>)',
      // 	muted: {
      // 		DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
      // 		foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
      // 	},
      // 	popover: {
      // 		DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
      // 		foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
      // 	},

      // 	primary: {
      // 		DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
      // 		foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
      // 		hover: 'hsl(var(--primary-hover) / <alpha-value>)',
      // 	},

      // 	ring: 'hsl(var(--ring) / <alpha-value>)',

      // 	secondary: {
      // 		DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
      // 		foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
      // 	},
      // },
      fontFamily: {
        crimson: ["Crimson Pro Variable", ...defaultTheme.fontFamily.serif],
        newsreader: ["Newsreader", ...defaultTheme.fontFamily.serif],
        sans: ["InterVar", ...defaultTheme.fontFamily.sans],
        serif: ["Newsreader", "Baskerville", ...defaultTheme.fontFamily.serif],
      },
      gridTemplateColumns: {
        overlap: "repeat(auto-fit,  minmax(10px, max-content))",
      },
      keyframes: {
        flash: {
          from: {
            "background-color": "hsl(var(--accent))",
            color: "hsl(var(--accent-foreground))",
          },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        scale: {
          // scale to 1.5 then back
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.25)" },
        },
        skeleton: {
          from: {
            backgroundColor: "var(--gray-a3)",
          },
          to: {
            backgroundColor: "var(--gray-a4)",
          },
        },
      },

      maxWidth: {
        "prose-long": "76ch",
      },

      screens: {
        "3xl": "1600px",
      },
      transitionDuration: {
        quick: "0.15s",
      },
      transitionProperty: {
        "text-color": "color",
      },
      typography: ({ theme }) => ({
        gold: {
          "--tw-prose-body": "#fff",
        },
      }),
    },
    supports: {
      cq: "container-type: inline-size",
      ncq: "not(container-type: inline-size)",
      p3: "color: color(display-p3 1 1 1)",
    },
  },
} satisfies Config

export default config
