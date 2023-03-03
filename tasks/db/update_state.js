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
	const states = await prisma.state.deleteMany();
	console.log({ states });
	const annotations = await prisma.annotation.findMany();
	for (const annotation of annotations) {
		await prisma.annotation.update({
			where: {
				id: annotation.id,
			},
			data: {
				stateId: 0,
			},
		});
	}
	const data = await prisma.user.findMany();
	console.log({ data });
	const { id: userId } = data[0];
	console.log({ userId });
	const create = [
		{
			name: 'Inbox',
			type: 'inbox',
			position: 0,
			read_later: false,
			userId,
		},
		{
			name: 'Next',
			type: 'soon',
			position: 0,
			read_later: true,
			userId,
		},
		{
			name: 'Later',
			type: 'later',
			position: 0,
			read_later: true,
			userId,
		},
		{
			name: 'Archive',
			type: 'archive',
			position: 0,
			read_later: false,
			userId,
		},
	];
	return await prisma.state.createMany({
		data: create,
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
