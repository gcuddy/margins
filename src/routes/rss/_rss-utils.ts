import type { Article, Prisma } from '@prisma/client';
import type Parser from 'rss-parser';
import cheerio from 'cheerio';

// use rehype-parse instead of cheerio?
// do i get cheerio 'for free' since my parser uses it?

function getImageAndWordCountFromHtml(html: string) {
	const $ = cheerio.load(html);
	const image = $('img').attr('src') || '';
	// get word count from cheerio root element - i get a type error here but not sure how to fix
	// const wordCount: number = $?.text().split(' ').length || -1;
	return { image, wordCount: -1 };
}

export function convertItemToArticle(item: Parser.Item): Prisma.ArticleCreateInput {
	const { image, wordCount } = getImageAndWordCountFromHtml(item.content);
	return {
		title: item.title || '',
		content: item.content || '',
		author: item.creator || '',
		url: item.guid || item.link || '',
		date: item.isoDate || '',
		image,
		wordCount
	};
}
