# indielangs.org

A directory of indie programming languages — the ones people build by hand because they
wanted to build a language.

**[Add yours →](CONTRIBUTING.md)**

## How it works

Every language is a folder in `src/content/languages/`, containing an `index.md` and a
logo. The folder name is the URL. Nothing outside that folder needs to change to add,
update, or remove a language, so submissions never conflict with each other.

```txt
src/content/languages/x3/
├── index.md      # schema-validated frontmatter + optional Markdown body
└── logo.png      # found by name; any reasonable size
```

Frontmatter is validated by [a Zod schema](src/lib/content/schema.ts) at build time and on
every pull request. `src/content/language.schema.json` is generated from it, which is what
gives contributors autocomplete and inline errors in their editor — including the GitHub
web editor.

## Running it

```bash
npm ci
npm run dev        # http://localhost:5173
```

| | |
|---|---|
| `npm run dev` | development server |
| `npm run build` | prerender the whole site to `build/` |
| `npm run preview` | serve the built site |
| `npm run validate` | check every language file — same check CI runs |
| `npm run schema` | regenerate `language.schema.json` after editing the Zod schema |
| `npm run check` | type-check |

SvelteKit with `adapter-static`; the output is a folder of HTML files with no server.

## Contributing

[CONTRIBUTING.md](CONTRIBUTING.md) covers adding a language. For anything else — a bug, a
design change, a new field on the schema — open an issue first so we can talk about it.

## Licence

[MIT](LICENSE). Language names, logos, and descriptions belong to the people who made them.
