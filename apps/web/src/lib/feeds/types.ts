export type FeedMeta = {
	author?: string;
	categories?: Array<string>;
	description?: string;
	explicit?: boolean;
	imageURL?: string;
	language?: string;
	link?: string;
	owner?: Owner;
	subtitle?: string;
	summary?: string;
	title?: string;
};

export type Owner = {
	email?: string;
	name?: string;
};

export type PodcastEpisode = {
	blocked: boolean | undefined;
	description: string;
	duration: number;
	enclosure: {
		length: string;
		type: string;
		url: string;
	};
	explicit: boolean;
	imageURL: string | undefined;
	language: string | undefined;
	link: string | undefined;
	order: number | undefined;
	pubDate: string;
	subtitle: string;
	summary: string;
	title: string;
};
