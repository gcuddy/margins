import { parse, stringify } from "css";

import { entryDetailsQuery, getEntriesFromCache } from "$lib/features/entries/queries";

import type { PageLoad } from "./$types";

function scopeCss(css: string) {
	console.time("scopeCss");
	const ast = parse(css);
	if (!ast.stylesheet) return;
	ast.stylesheet.rules = ast.stylesheet.rules.map((rule) => {
		if (rule.type === "rule" && "selectors" in rule) {
			rule.selectors = rule.selectors?.map((selector) => {
				return `#entry-container ${selector}`;
			});
		}
		return rule;
	});

	const str = stringify(ast);
	console.timeEnd("scopeCss");
	return str;
}

export const load = (async (event) => {
    const { data, parent } = event;
	const parentData = await parent();


    // TODO: queryclient stuff here
    const { queryClient } = parentData;
    // first, check for cached data and use as placeholder
    // then ensurequerydata
    const entries = getEntriesFromCache(queryClient);
    const placeholderData = entries.find(e => e.id === data.id);

    // prefetch query
    const article = queryClient.ensureQueryData(entryDetailsQuery({
        id: data.id
    }, event))
    console.time("stylesheet");
	const stylesheet = parentData.user?.stylesheets?.find((s) => article?.uri?.includes(s.domain));
	console.log({ stylesheet });

	if (stylesheet) {
		// SCOPE STYLESHEET
		return {
			...data,
            article,
			css: scopeCss(stylesheet.css),
		};
	}
	console.timeEnd("stylesheet");
	return {
		...data,
        article,
        placeholderData
	};
}) satisfies PageLoad;
