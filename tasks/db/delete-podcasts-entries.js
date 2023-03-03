import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
	await prisma.entry.deleteMany({
		where: {
			podcastIndexId: {
				not: null,
			},
		},
	});
}

main();
