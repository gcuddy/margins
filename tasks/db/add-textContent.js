import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { parse } from 'node-html-parser';

function getTextContent(html) {
	console.log({ html });
	const root = parse(html);
	const textContent = root.textContent;
	return textContent;
}

async function main() {
	const articles = await prisma.article.findMany();
	for (const article of articles) {
		if (article.textContent) continue;
		const textContent = getTextContent(article.content);
		await prisma.article.update({
			where: { id: article.id },
			data: { textContent }
		});
	}
}

main();
