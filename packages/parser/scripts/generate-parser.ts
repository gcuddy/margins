import type { Question } from 'inquirer';
import inquirer from 'inquirer';
import type { Ora } from 'ora';
import ora from 'ora';
import { exists, mkdir } from 'node:fs/promises';

// TODO: rest of test scaffolding

function validateURL(u: string) {
	try {
		const { hostname } = new URL(u);
		if (hostname) return true;
	} catch {
		return false;
	}
	return false;
}

let spinner: Ora;

const question: Question<{
	website: string;
}> = {
	message:
		"Paste a url to an article you'd like to create or extend a parser for:",
	name: 'website',
	type: 'input',
	validate(value: string) {
		return validateURL(value);
	},
};

const testOrExtractor = {
	choices: [
		{
			name: 'Both (test + extractor)',
		},
		{
			name: 'Extractor',
		},
		{
			name: 'Test',
		},
	],
	message: 'Do you want to scaffold out a custom extractor, test, or both?',
	name: 'choice',
	type: 'list',
};

const questions = [question, testOrExtractor];

const urlArg = Bun.argv[2];

if (urlArg) {
	// scafoo
} else {
	const answer = (await inquirer.prompt(questions)) as {
		choice: string;
		website: string;
	};

	await scaffold(
		answer.website,
		(answer.choice.includes('Both')
			? ['test', 'extractor']
			: answer.choice.includes('Test')
				? ['test']
				: ['extractor']) satisfies ('test' | 'extractor')[],
	);
}

async function fetchPage(url: string) {
	spinner = ora({ text: 'Fetching page...' });
	spinner.start();
	const text = await fetch(url).then((r) => r.text());
	spinner.succeed();
	return text;
}

async function scaffold(websiteUrl: string, make: ('test' | 'extractor')[]) {
	const url = new URL(websiteUrl);
	const { hostname } = url;
	let newParser = false;
	for (const m of make) {
		if (m === 'test') {
			const fixturesDir = `./fixtures/${hostname}`;
			const doesExist = await exists(fixturesDir);
			if (!doesExist) {
				newParser = true;
				spinner = ora({ text: 'Creating fixture directory...' });
				spinner.start();
				await mkdir(fixturesDir, { recursive: true });
				spinner.succeed();
			}
			const html = await fetchPage(websiteUrl);
			await savePage(hostname, html, newParser);
		} else if (m === 'extractor') {
			const dir = `./src/extractors/custom/${hostname}`;
			const doesExist = await exists(dir);
			if (!doesExist) {
				spinner = ora({ text: 'Creating extractor directory...' });
				spinner.start();
				await mkdir(dir, { recursive: true });
				spinner.succeed();
			}
		}
	}
}

async function savePage(hostname: string, html: string, isNewParser: boolean) {
	const filename = new Date().getTime();
	const file = `./fixtures/${hostname}/${filename}.html`;
	// TODO: make links absolute, do cleaning
	spinner = ora({ text: 'Saving page...' });
	spinner.start();
	await Bun.write(file, html);
	spinner.succeed();
}
