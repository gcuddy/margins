import type { ParamMatcher } from "@sveltejs/kit"

export const match: ParamMatcher = s => /^gb_/i.test(s)
