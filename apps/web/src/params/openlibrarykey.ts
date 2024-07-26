import type { ParamMatcher } from "@sveltejs/kit"

export const match: ParamMatcher = s => /^ol/i.test(s)
