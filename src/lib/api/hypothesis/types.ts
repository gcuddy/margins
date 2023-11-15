export type HypothesisGroup = {
	name: string;
	id: string;
	public: boolean;
	url?: string;
};

export type HypothesisProfile = {
	userid: string;
	groups: HypothesisGroup[];
};

export type HypothesisAnnotation = {
	consumer: string;
	id: string;
	created: string;
	updated: string;
	user: string;
	uri: string;
	text: string;
	tags: string[];
	group: string;
	target: {
		source: string;
		selector: {
			type: string;
			value: string | null;
			conformsTo: string | null;
			// exact: string;
			// prefix: string;
			// suffix: string;
			// start: number;
			// end: number;
		}[];
	}[];
	document: {
		title: string[];
	};
};

export type HypothesisSearchResponse = {
	total: number;
	rows: HypothesisAnnotation[];
};
