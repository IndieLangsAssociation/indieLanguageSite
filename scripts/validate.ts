import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parseLanguage } from '../src/lib/content/parse.ts';

/*
 * Runs on every pull request. The site has been broken three separate ways by
 * submissions that looked fine to the person sending them:
 *   - an unterminated string in the shared data file took the build down
 *   - a logo path pointed at a file nobody ever committed
 *   - a logo path missing its leading slash 404'd on one page only
 * Everything here exists because one of those happened.
 */

const ROOT = 'src/content/languages';
const LOGO_LIMIT = 300 * 1024;
const LOGO_NAMES = ['logo.png', 'logo.webp', 'logo.jpg', 'logo.jpeg', 'logo.svg'];
const SLUG = /^[a-z\d](?:[a-z\d-]*[a-z\d])?$/;

const problems: string[] = [];
const seenNames = new Map<string, string>();
let count = 0;

function fail(where: string, message: string) {
	problems.push(`${where}\n    ${message}`);
}

const slugs = readdirSync(ROOT, { withFileTypes: true })
	.filter((entry) => entry.isDirectory())
	.map((entry) => entry.name)
	.sort();

if (slugs.length === 0) {
	console.error(`No language folders found in ${ROOT}/`);
	process.exit(1);
}

for (const slug of slugs) {
	const dir = join(ROOT, slug);
	const file = join(dir, 'index.md');
	count++;

	if (!SLUG.test(slug)) {
		fail(
			dir,
			`the folder name becomes the URL, so it must be lowercase letters, digits and hyphens only`
		);
		continue;
	}

	let raw: string;
	try {
		raw = readFileSync(file, 'utf8');
	} catch {
		fail(dir, `no index.md here — every language folder needs one`);
		continue;
	}

	const result = parseLanguage(raw);
	if (!result.ok) {
		for (const error of result.errors) fail(file, error);
		continue;
	}

	// Two languages with the same display name are indistinguishable on the board.
	const key = result.data.name.toLowerCase();
	const twin = seenNames.get(key);
	if (twin) fail(file, `the name "${result.data.name}" is already used by ${twin}`);
	else seenNames.set(key, slug);

	const logos = LOGO_NAMES.filter((name) => {
		try {
			return statSync(join(dir, name)).isFile();
		} catch {
			return false;
		}
	});

	if (logos.length > 1) {
		fail(dir, `more than one logo here (${logos.join(', ')}) — keep one`);
	}

	for (const logo of logos) {
		const size = statSync(join(dir, logo)).size;
		if (size > LOGO_LIMIT) {
			fail(
				join(dir, logo),
				`${Math.round(size / 1024)} KB is over the ${LOGO_LIMIT / 1024} KB limit — ` +
					`resize it to about 512px and re-export`
			);
		}
	}

	// Not an error. Plenty of languages have no runnable backend and no logo.
	if (logos.length === 0) {
		console.log(`  ${slug}: no logo, the plate will show "${result.data.name[0]}"`);
	}
}

if (problems.length > 0) {
	console.error(`\n${problems.length} problem${problems.length > 1 ? 's' : ''} found:\n`);
	for (const problem of problems) console.error(`  ${problem}\n`);
	console.error('See CONTRIBUTING.md for the field reference.\n');
	process.exit(1);
}

console.log(`\n${count} language${count === 1 ? '' : 's'} — all valid.`);
