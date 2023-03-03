import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
	// Default states
	const inboxState = await prisma.state.create({
		data: {
			name: 'Inbox',
			position: 0,
			type: 'inbox',
			read_later: false,
			// id: 0,
		},
	});
	const nextState = await prisma.state.create({
		data: {
			name: 'Next',
			position: 0,
			type: 'soon',
			read_later: false,
			// id: 1,
		},
	});
	const laterState = await prisma.state.create({
		data: {
			name: 'Later',
			position: 0,
			type: 'later',
			read_later: false,
			// id: 2,
		},
	});
	const archiveState = await prisma.state.create({
		data: {
			name: 'Archive',
			position: 0,
			type: 'archive',
			read_later: false,
			// id: 3,
		},
	});
	console.log({ inboxState, archiveState, nextState, laterState });
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
