import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    await prisma.entry.delete({
        where: {
            id: 6672
        }
    })
}

main();
