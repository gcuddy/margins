const args = process.argv.slice(2);
const uri = args[0];

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
	// const deleted = await prisma.feed.delete({
	// 	where: {
	// 		feedUrl: uri,
	// 	},
	// });
	// console.log(`Deleted ${deleted.id}`);
	// TODO: wait for confirmation on this
	const { count } = await prisma.entry.deleteMany({
		where: {
			uri: {
				startsWith: uri,
			},
		},
	});
	console.log(`Deleted ${count} entries`);
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
