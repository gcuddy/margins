export const colors = {
	Red: '#ef4444',
	Amber: '#f59e0b',
	Green: '#10b981',
	Blue: '#3b82f6',
	Indigo: '#6366f1',
	"Light Gray": '#e7e5e4',
	Gray: "#78716c",
	"Dark Gray": "#292524",
} as const;

export type Color = keyof typeof colors;

export const tailwindColors = [
	{
		"name": "slate-50",
		"value": "#f8fafc"
	},
	{
		"name": "slate-100",
		"value": "#f1f5f9"
	},
	{
		"name": "slate-200",
		"value": "#e2e8f0"
	},
	{
		"name": "slate-300",
		"value": "#cbd5e1"
	},
	{
		"name": "slate-400",
		"value": "#94a3b8"
	},
	{
		"name": "slate-500",
		"value": "#64748b"
	},
	{
		"name": "slate-600",
		"value": "#475569"
	},
	{
		"name": "slate-700",
		"value": "#334155"
	},
	{
		"name": "slate-800",
		"value": "#1e293b"
	},
	{
		"name": "slate-900",
		"value": "#0f172a"
	},
	{
		"name": "gray-50",
		"value": "#fafaf9"
	},
	{
		"name": "gray-100",
		"value": "#f5f5f4"
	},
	{
		"name": "gray-200",
		"value": "#e7e5e4"
	},
	{
		"name": "gray-300",
		"value": "#d6d3d1"
	},
	{
		"name": "gray-400",
		"value": "#a8a29e"
	},
	{
		"name": "gray-500",
		"value": "#78716c"
	},
	{
		"name": "gray-600",
		"value": "#57534e"
	},
	{
		"name": "gray-700",
		"value": "#44403c"
	},
	{
		"name": "gray-800",
		"value": "#292524"
	},
	{
		"name": "gray-900",
		"value": "#1c1917"
	},
	{
		"name": "zinc-50",
		"value": "#fafafa"
	},
	{
		"name": "zinc-100",
		"value": "#f4f4f5"
	},
	{
		"name": "zinc-200",
		"value": "#e4e4e7"
	},
	{
		"name": "zinc-300",
		"value": "#d4d4d8"
	},
	{
		"name": "zinc-400",
		"value": "#a1a1aa"
	},
	{
		"name": "zinc-500",
		"value": "#71717a"
	},
	{
		"name": "zinc-600",
		"value": "#52525b"
	},
	{
		"name": "zinc-700",
		"value": "#3f3f46"
	},
	{
		"name": "zinc-800",
		"value": "#27272a"
	},
	{
		"name": "zinc-900",
		"value": "#18181b"
	},
	{
		"name": "neutral-50",
		"value": "#fafafa"
	},
	{
		"name": "neutral-100",
		"value": "#f5f5f5"
	},
	{
		"name": "neutral-200",
		"value": "#e5e5e5"
	},
	{
		"name": "neutral-300",
		"value": "#d4d4d4"
	},
	{
		"name": "neutral-400",
		"value": "#a3a3a3"
	},
	{
		"name": "neutral-500",
		"value": "#737373"
	},
	{
		"name": "neutral-600",
		"value": "#525252"
	},
	{
		"name": "neutral-700",
		"value": "#404040"
	},
	{
		"name": "neutral-800",
		"value": "#262626"
	},
	{
		"name": "neutral-900",
		"value": "#171717"
	},
	{
		"name": "stone-50",
		"value": "#fafaf9"
	},
	{
		"name": "stone-100",
		"value": "#f5f5f4"
	},
	{
		"name": "stone-200",
		"value": "#e7e5e4"
	},
	{
		"name": "stone-300",
		"value": "#d6d3d1"
	},
	{
		"name": "stone-400",
		"value": "#a8a29e"
	},
	{
		"name": "stone-500",
		"value": "#78716c"
	},
	{
		"name": "stone-600",
		"value": "#57534e"
	},
	{
		"name": "stone-700",
		"value": "#44403c"
	},
	{
		"name": "stone-800",
		"value": "#292524"
	},
	{
		"name": "stone-900",
		"value": "#1c1917"
	},
	{
		"name": "red-50",
		"value": "#fef2f2"
	},
	{
		"name": "red-100",
		"value": "#fee2e2"
	},
	{
		"name": "red-200",
		"value": "#fecaca"
	},
	{
		"name": "red-300",
		"value": "#fca5a5"
	},
	{
		"name": "red-400",
		"value": "#f87171"
	},
	{
		"name": "red-500",
		"value": "#ef4444"
	},
	{
		"name": "red-600",
		"value": "#dc2626"
	},
	{
		"name": "red-700",
		"value": "#b91c1c"
	},
	{
		"name": "red-800",
		"value": "#991b1b"
	},
	{
		"name": "red-900",
		"value": "#7f1d1d"
	},
	{
		"name": "orange-50",
		"value": "#fff7ed"
	},
	{
		"name": "orange-100",
		"value": "#ffedd5"
	},
	{
		"name": "orange-200",
		"value": "#fed7aa"
	},
	{
		"name": "orange-300",
		"value": "#fdba74"
	},
	{
		"name": "orange-400",
		"value": "#fb923c"
	},
	{
		"name": "orange-500",
		"value": "#f97316"
	},
	{
		"name": "orange-600",
		"value": "#ea580c"
	},
	{
		"name": "orange-700",
		"value": "#c2410c"
	},
	{
		"name": "orange-800",
		"value": "#9a3412"
	},
	{
		"name": "orange-900",
		"value": "#7c2d12"
	},
	{
		"name": "amber-50",
		"value": "#fffbeb"
	},
	{
		"name": "amber-100",
		"value": "#fef3c7"
	},
	{
		"name": "amber-200",
		"value": "#fde68a"
	},
	{
		"name": "amber-300",
		"value": "#fcd34d"
	},
	{
		"name": "amber-400",
		"value": "#fbbf24"
	},
	{
		"name": "amber-500",
		"value": "#f59e0b"
	},
	{
		"name": "amber-600",
		"value": "#d97706"
	},
	{
		"name": "amber-700",
		"value": "#b45309"
	},
	{
		"name": "amber-800",
		"value": "#92400e"
	},
	{
		"name": "amber-900",
		"value": "#78350f"
	},
	{
		"name": "yellow-50",
		"value": "#fefce8"
	},
	{
		"name": "yellow-100",
		"value": "#fef9c3"
	},
	{
		"name": "yellow-200",
		"value": "#fef08a"
	},
	{
		"name": "yellow-300",
		"value": "#fde047"
	},
	{
		"name": "yellow-400",
		"value": "#facc15"
	},
	{
		"name": "yellow-500",
		"value": "#eab308"
	},
	{
		"name": "yellow-600",
		"value": "#ca8a04"
	},
	{
		"name": "yellow-700",
		"value": "#a16207"
	},
	{
		"name": "yellow-800",
		"value": "#854d0e"
	},
	{
		"name": "yellow-900",
		"value": "#713f12"
	},
	{
		"name": "lime-50",
		"value": "#f7fee7"
	},
	{
		"name": "lime-100",
		"value": "#ecfccb"
	},
	{
		"name": "lime-200",
		"value": "#d9f99d"
	},
	{
		"name": "lime-300",
		"value": "#bef264"
	},
	{
		"name": "lime-400",
		"value": "#a3e635"
	},
	{
		"name": "lime-500",
		"value": "#84cc16"
	},
	{
		"name": "lime-600",
		"value": "#65a30d"
	},
	{
		"name": "lime-700",
		"value": "#4d7c0f"
	},
	{
		"name": "lime-800",
		"value": "#3f6212"
	},
	{
		"name": "lime-900",
		"value": "#365314"
	},
	{
		"name": "green-50",
		"value": "#f0fdf4"
	},
	{
		"name": "green-100",
		"value": "#dcfce7"
	},
	{
		"name": "green-200",
		"value": "#bbf7d0"
	},
	{
		"name": "green-300",
		"value": "#86efac"
	},
	{
		"name": "green-400",
		"value": "#4ade80"
	},
	{
		"name": "green-500",
		"value": "#22c55e"
	},
	{
		"name": "green-600",
		"value": "#16a34a"
	},
	{
		"name": "green-700",
		"value": "#15803d"
	},
	{
		"name": "green-800",
		"value": "#166534"
	},
	{
		"name": "green-900",
		"value": "#14532d"
	},
	{
		"name": "emerald-50",
		"value": "#ecfdf5"
	},
	{
		"name": "emerald-100",
		"value": "#d1fae5"
	},
	{
		"name": "emerald-200",
		"value": "#a7f3d0"
	},
	{
		"name": "emerald-300",
		"value": "#6ee7b7"
	},
	{
		"name": "emerald-400",
		"value": "#34d399"
	},
	{
		"name": "emerald-500",
		"value": "#10b981"
	},
	{
		"name": "emerald-600",
		"value": "#059669"
	},
	{
		"name": "emerald-700",
		"value": "#047857"
	},
	{
		"name": "emerald-800",
		"value": "#065f46"
	},
	{
		"name": "emerald-900",
		"value": "#064e3b"
	},
	{
		"name": "teal-50",
		"value": "#f0fdfa"
	},
	{
		"name": "teal-100",
		"value": "#ccfbf1"
	},
	{
		"name": "teal-200",
		"value": "#99f6e4"
	},
	{
		"name": "teal-300",
		"value": "#5eead4"
	},
	{
		"name": "teal-400",
		"value": "#2dd4bf"
	},
	{
		"name": "teal-500",
		"value": "#14b8a6"
	},
	{
		"name": "teal-600",
		"value": "#0d9488"
	},
	{
		"name": "teal-700",
		"value": "#0f766e"
	},
	{
		"name": "teal-800",
		"value": "#115e59"
	},
	{
		"name": "teal-900",
		"value": "#134e4a"
	},
	{
		"name": "cyan-50",
		"value": "#ecfeff"
	},
	{
		"name": "cyan-100",
		"value": "#cffafe"
	},
	{
		"name": "cyan-200",
		"value": "#a5f3fc"
	},
	{
		"name": "cyan-300",
		"value": "#67e8f9"
	},
	{
		"name": "cyan-400",
		"value": "#22d3ee"
	},
	{
		"name": "cyan-500",
		"value": "#06b6d4"
	},
	{
		"name": "cyan-600",
		"value": "#0891b2"
	},
	{
		"name": "cyan-700",
		"value": "#0e7490"
	},
	{
		"name": "cyan-800",
		"value": "#155e75"
	},
	{
		"name": "cyan-900",
		"value": "#164e63"
	},
	{
		"name": "sky-50",
		"value": "#f0f9ff"
	},
	{
		"name": "sky-100",
		"value": "#e0f2fe"
	},
	{
		"name": "sky-200",
		"value": "#bae6fd"
	},
	{
		"name": "sky-300",
		"value": "#7dd3fc"
	},
	{
		"name": "sky-400",
		"value": "#38bdf8"
	},
	{
		"name": "sky-500",
		"value": "#0ea5e9"
	},
	{
		"name": "sky-600",
		"value": "#0284c7"
	},
	{
		"name": "sky-700",
		"value": "#0369a1"
	},
	{
		"name": "sky-800",
		"value": "#075985"
	},
	{
		"name": "sky-900",
		"value": "#0c4a6e"
	},
	{
		"name": "blue-50",
		"value": "#eff6ff"
	},
	{
		"name": "blue-100",
		"value": "#dbeafe"
	},
	{
		"name": "blue-200",
		"value": "#bfdbfe"
	},
	{
		"name": "blue-300",
		"value": "#93c5fd"
	},
	{
		"name": "blue-400",
		"value": "#60a5fa"
	},
	{
		"name": "blue-500",
		"value": "#3b82f6"
	},
	{
		"name": "blue-600",
		"value": "#2563eb"
	},
	{
		"name": "blue-700",
		"value": "#1d4ed8"
	},
	{
		"name": "blue-800",
		"value": "#1e40af"
	},
	{
		"name": "blue-900",
		"value": "#1e3a8a"
	},
	{
		"name": "indigo-50",
		"value": "#eef2ff"
	},
	{
		"name": "indigo-100",
		"value": "#e0e7ff"
	},
	{
		"name": "indigo-200",
		"value": "#c7d2fe"
	},
	{
		"name": "indigo-300",
		"value": "#a5b4fc"
	},
	{
		"name": "indigo-400",
		"value": "#818cf8"
	},
	{
		"name": "indigo-500",
		"value": "#6366f1"
	},
	{
		"name": "indigo-600",
		"value": "#4f46e5"
	},
	{
		"name": "indigo-700",
		"value": "#4338ca"
	},
	{
		"name": "indigo-800",
		"value": "#3730a3"
	},
	{
		"name": "indigo-900",
		"value": "#312e81"
	},
	{
		"name": "violet-50",
		"value": "#f5f3ff"
	},
	{
		"name": "violet-100",
		"value": "#ede9fe"
	},
	{
		"name": "violet-200",
		"value": "#ddd6fe"
	},
	{
		"name": "violet-300",
		"value": "#c4b5fd"
	},
	{
		"name": "violet-400",
		"value": "#a78bfa"
	},
	{
		"name": "violet-500",
		"value": "#8b5cf6"
	},
	{
		"name": "violet-600",
		"value": "#7c3aed"
	},
	{
		"name": "violet-700",
		"value": "#6d28d9"
	},
	{
		"name": "violet-800",
		"value": "#5b21b6"
	},
	{
		"name": "violet-900",
		"value": "#4c1d95"
	},
	{
		"name": "purple-50",
		"value": "#faf5ff"
	},
	{
		"name": "purple-100",
		"value": "#f3e8ff"
	},
	{
		"name": "purple-200",
		"value": "#e9d5ff"
	},
	{
		"name": "purple-300",
		"value": "#d8b4fe"
	},
	{
		"name": "purple-400",
		"value": "#c084fc"
	},
	{
		"name": "purple-500",
		"value": "#a855f7"
	},
	{
		"name": "purple-600",
		"value": "#9333ea"
	},
	{
		"name": "purple-700",
		"value": "#7e22ce"
	},
	{
		"name": "purple-800",
		"value": "#6b21a8"
	},
	{
		"name": "purple-900",
		"value": "#581c87"
	},
	{
		"name": "fuchsia-50",
		"value": "#fdf4ff"
	},
	{
		"name": "fuchsia-100",
		"value": "#fae8ff"
	},
	{
		"name": "fuchsia-200",
		"value": "#f5d0fe"
	},
	{
		"name": "fuchsia-300",
		"value": "#f0abfc"
	},
	{
		"name": "fuchsia-400",
		"value": "#e879f9"
	},
	{
		"name": "fuchsia-500",
		"value": "#d946ef"
	},
	{
		"name": "fuchsia-600",
		"value": "#c026d3"
	},
	{
		"name": "fuchsia-700",
		"value": "#a21caf"
	},
	{
		"name": "fuchsia-800",
		"value": "#86198f"
	},
	{
		"name": "fuchsia-900",
		"value": "#701a75"
	},
	{
		"name": "pink-50",
		"value": "#fdf2f8"
	},
	{
		"name": "pink-100",
		"value": "#fce7f3"
	},
	{
		"name": "pink-200",
		"value": "#fbcfe8"
	},
	{
		"name": "pink-300",
		"value": "#f9a8d4"
	},
	{
		"name": "pink-400",
		"value": "#f472b6"
	},
	{
		"name": "pink-500",
		"value": "#ec4899"
	},
	{
		"name": "pink-600",
		"value": "#db2777"
	},
	{
		"name": "pink-700",
		"value": "#be185d"
	},
	{
		"name": "pink-800",
		"value": "#9d174d"
	},
	{
		"name": "pink-900",
		"value": "#831843"
	},
	{
		"name": "rose-50",
		"value": "#fff1f2"
	},
	{
		"name": "rose-100",
		"value": "#ffe4e6"
	},
	{
		"name": "rose-200",
		"value": "#fecdd3"
	},
	{
		"name": "rose-300",
		"value": "#fda4af"
	},
	{
		"name": "rose-400",
		"value": "#fb7185"
	},
	{
		"name": "rose-500",
		"value": "#f43f5e"
	},
	{
		"name": "rose-600",
		"value": "#e11d48"
	},
	{
		"name": "rose-700",
		"value": "#be123c"
	},
	{
		"name": "rose-800",
		"value": "#9f1239"
	},
	{
		"name": "rose-900",
		"value": "#881337"
	},
	{
		"name": "White",
		"value": "#fff"
	},
	{
		"name": "Black",
		"value": "#000"
	}
]