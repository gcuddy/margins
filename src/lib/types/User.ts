import { Prisma } from '@prisma/client';

const userData = Prisma.validator<Prisma.UserArgs>()({
	select: {
		email: true,
		following: true,
		username: true,
		id: true,
	},
});

export type UserData = Prisma.UserGetPayload<typeof userData>;
