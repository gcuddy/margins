import { Prisma } from '@prisma/client';
import type Icon from '../components/helpers/Icon.svelte';
import type { IconName } from '../icons';
import type { ComponentProperties } from '../stores/types';

// 1. Define a User type that includes the "cars" relation.
const articleWithNotesAndTags = Prisma.validator<Prisma.ArticleArgs>()({
	include: { annotations: true, highlights: true, tags: true, context: true }
});

// 2: This type will include many users and all their cars
export type ArticleWithNotesAndTagsAndContext = Prisma.ArticleGetPayload<
	typeof articleWithNotesAndTags
>;

const articleWithTags = Prisma.validator<Prisma.ArticleArgs>()({
	include: { tags: true }
});
export type ArticleWithTags = Prisma.ArticleGetPayload<typeof articleWithTags>;

const tagWithArticles = Prisma.validator<Prisma.TagArgs>()({
	include: {
		articles: true
	}
});
export type TagWithArticle = Prisma.TagGetPayload<typeof tagWithArticles>;

const articleWithAnnotations = Prisma.validator<Prisma.ArticleArgs>()({
	include: { annotations: true }
});
export type ArticleWithAnnotations = Prisma.ArticleGetPayload<typeof articleWithAnnotations>;

export type AnnotationWithArticle = Prisma.AnnotationGetPayload<{
	include: { article: true };
}>;

// const createFeedWithItems = Prisma.validator<Prisma.RssFeedCreateInput>()({
// 	include: {
// 		items: true
// 	}
// });

// export type CreateFeedWithItems = Prisma.RssFeedGetPayload<typeof createFeedWithItems>;

const feedWithItems = Prisma.validator<Prisma.RssFeedArgs>()({
	include: {
		items: true
	}
});

export type FeedWithItems = Prisma.RssFeedGetPayload<typeof feedWithItems>;

export interface Tooltip {
	visible: boolean;
	top: number;
	left?: number;
}

export interface NodeRef {
	$node?: Node;
	/**
	 * unique css selector for this node. if it fails, tagName and index will be used
	 */
	selector: string;
	tagName: string;
	index: number;
}

export interface DomMeta {
	parentTagName: string;
	parentIndex: number;
	textOffset: number;
}

export interface SimplifiedHighlightSource {
	startMeta?: DomMeta;
	endMeta?: DomMeta;
	text: string;
	id: string;
}

export interface AnnotationPos {
	pos: number;
	node: NodeRef;
}

export enum Locations {
	INBOX = 'INBOX',
	SOON = 'SOON',
	LATER = 'LATER'
}

// TODO 2022-07-09 use this for Menu, CommandPalette, Sidebar, etc.
interface GenericItem {
	display: string;
	icon: IconName;
	iconProps?: ComponentProperties<Icon>;
	id: string | number;
	perform?: () => void;
	enabled?: () => boolean;
	kbd?: string[][]; // e.g. [ [ 'ctrl', 'c' ], [ 'shift', 'c' ] ]
}

// 1. Define a User type that includes the "cars" relation.
const listWithItems = Prisma.validator<Prisma.ListArgs>()({
	include: {
		items: {
			include: {
				article: true
			}
		}
	}
});

// 2: This type will include many users and all their cars
export type ListWithItems = Prisma.ListGetPayload<typeof listWithItems>;