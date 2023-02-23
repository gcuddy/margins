import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
	// const annotations = await prisma.annotation.findMany({
	// 	where: {
	// 		AND: [
	// 			// {
	// 			// 	contentData: {
	// 			// 		not: {
	// 			// 			equals: null,
	// 			// 		},
	// 			// 	},
	// 			// },
	// 			{
	// 				contentData: {
	// 					path: "$.content[*].content[*].text",
	// 					array_contains: "strikes in `70s",
	// 				},
	// 			},
	// 		],
	// 	},
	// });
	const annotations = await prisma.annotation.findMany({
		where: {
			AND: [
				// {
				// 	contentData: {
				// 		not: {
				// 			equals: null,
				// 		},
				// 	},
				// },
				{
					contentData: {
						not: {
							equals: null,
						},
					},
				},
			],
		},
	});
	// could search this way too..
	// get contentdata, then search through the contentdata prosemirror json myself
    console.time("search")
    const input = "Ray"
	annotations.filter((a) => {
		/** @type {import('@tiptap/core').JSONContent} */
		let contentData = a.contentData;
        // walk through all "text" nodes and search for input
        let found = false
        function recurse(node) {
            if (node.type === "text") {
                if (node.text.toLowerCase().includes(input.toLowerCase())) {
                    console.log("found", node.text)
                    found = true
                }
            }
            if (node.content) {
                node.content.forEach(recurse)
            }
        }
        recurse(contentData)
	});
    console.timeEnd("search");

	// console.dir({ annotations }  , { depth: null });
}

main();
