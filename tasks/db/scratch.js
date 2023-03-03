import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const entry = await prisma.entry.deleteMany({
        where:{
           feedId: 32,
           published: {
                // less than one month ago
                lt: new Date(new Date().setDate(new Date().getDate() - 30))
           }
        },
    })
    console.log(entry.length)
	// })
}

main();
