// NOTE: A lot of this is taken from @postlight/parser - a wonderul package!

export type ExtractionOptions = {
	cleanConditionally: boolean;
	stripUnlikelyCandidates: boolean;
	weightNodes: boolean;
};

const defaultOptions: ExtractionOptions = {
	cleanConditionally: true,
	stripUnlikelyCandidates: true,
	weightNodes: true,
};

export function extract(opts?: ExtractionOptions) {
	const mergedOpts = { ...defaultOptions, ...opts };
}
