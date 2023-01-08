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
	const entries = await prisma.entry.findMany();
	for (const entry of entries) {
		if (entry.text || !entry.html) continue;
		const text = getTextContent(entry.html);
		await prisma.entry.update({
			where: { id: entry.id },
			data: { text }
		});
	}
}

main();
