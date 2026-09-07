import { writeFileSync } from 'node:fs';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { languageSchema } from '../src/lib/content/schema.ts';

/*
 * The Zod schema is the single source of truth. This mirrors it into JSON Schema
 * so editors — including the GitHub web editor — autocomplete field names and
 * underline mistakes while a contributor types.
 */
const OUT = 'src/content/language.schema.json';

const schema = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	title: 'indie langs language entry',
	description: 'Generated from src/lib/content/schema.ts — do not edit by hand.',
	...zodToJsonSchema(languageSchema, { $refStrategy: 'none', target: 'jsonSchema7' })
};

writeFileSync(OUT, `${JSON.stringify(schema, null, '\t')}\n`);
console.log(`wrote ${OUT}`);
