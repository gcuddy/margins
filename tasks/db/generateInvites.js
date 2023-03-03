import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
	// todo: limit invite codes
	const users = await prisma.user.findMany({
		include: {
			invitationCodes: {
				where: {
					used: false,
				},
			},
		},
	});
	// this an extremely slow way to do it, but it works for now
	for (const user of users) {
		const unusedCodes = user.invitationCodes.length;
		const codesToGive = Math.max(0, 3 - unusedCodes);
		const promises = [];
		for (let i = 0; i < codesToGive; i++) {
			promises.push(
				prisma.invitationCode.create({
					data: {
						owner: {
							connect: {
								id: user.id,
							},
						},
					},
				})
			);
		}
		const codes = await prisma.$transaction(promises);
		console.log(`Created ${codes.length} invitation codes for user ${user.username}`);
	}
}

main();
