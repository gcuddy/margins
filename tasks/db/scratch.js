import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
	const podcast = await prisma.entry.updateMany({
		where: {
			type: "audio",
            NOT: {
                enclosureUrl: {
                    contains: ".mp3"
                }
            }
		},
        data: {
            type: "article"
        }
	});
	console.log(podcast.length);
}

main();
