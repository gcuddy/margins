import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    await prisma.entry.updateMany({
        where: {
            type: "book"
        },
        data: {
            summary:null
        }
    })
}

main();
