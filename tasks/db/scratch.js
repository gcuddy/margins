import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const entry = await prisma.entry.findFirst({
        where:{
            id: 17802
        },
        include: {
            feed: {
                select: {
                    feedUrl: true
                }
            }
        }
    })
    const updated = await prisma.entry.update({
        where: {
            id: entry.id
        },
        data: {
            uri: entry.feed.feedUrl + '::' + entry.guid
        }
    })
    console.log({updated})
    // console.time("update uri with enclosure")
	// const entries = await prisma.entry.findMany({
	// 	where: {
	// 		uri: null,
	// 		enclosureUrl: {
	// 			not: null,
	// 		},
	// 	},
	// });
	// console.log({ entries });
	// // update uri field with enclosureUrl field
	// const promises = entries.map((entry) =>
	// 	prisma.entry.update({
	// 		where: {
	// 			id: entry.id,
	// 		},
	// 		data: {
	// 			uri: entry.enclosureUrl,
	// 		},
	// 	})
	// );
    // await prisma.$transaction(promises)
    // console.timeEnd("update uri with enclosure")
	// await prisma.entry.updateMany({
	//     where: {
	//         uri: null,
	//         enclosureUrl: {
	//             not: null
	//         }
	//     },
	//     data: {
	//         uri: prisma.entry.enclosureUrl
	//     }
	// })
}

main();
