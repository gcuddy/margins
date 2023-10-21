import { faker } from '@faker-js/faker';
import { db } from '../../src/lib/db';
async function main() {
	const entries = [];

	for (let i = 0; i < 100; i++) {
		entries.push({
			title: faker.lorem.words(3),
			url: faker.internet.url()
		});
	}
}
