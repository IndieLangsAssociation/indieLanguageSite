# Add your language

Everything about a language lives in one folder. Adding yours means adding a folder with
two files in it — a `index.md` describing the language, and a logo. Nothing else in the
repo needs to change, so your pull request can't conflict with anyone else's.

If you'd rather not use git at all, skip to [the form](#no-git-no-problem) at the bottom.

## 1. Make your folder

Fork this repository, then create:

```txt
src/content/languages/your-language/
```

The folder name becomes your URL — `indielangs.org/language/your-language` — so use
lowercase letters, digits and hyphens only.

## 2. Write index.md

Create `index.md` inside your folder:

```yaml
---
# yaml-language-server: $schema=../../language.schema.json
name: ExampleLang
tagline: A short line that shows up under your name
description: >-
  A paragraph about what your language is and why you made it. This is what people
  read on your language's page.
---
```

Those three fields are the only ones required. The `yaml-language-server` line is worth
keeping — it makes your editor autocomplete the field names and underline mistakes as you
type, including in the GitHub web editor.

Everything below is optional. Add what you have:

```yaml
tags: [esolang, interpreted]
by:
  name: Your Name
  github: your-username
links:
  website: https://example.com
  github: https://github.com/you/examplelang
  discord: https://discord.gg/example
highlight: clike
sample: |
  print("hello")
```

`sample` is worth filling in — it's the line of your syntax that shows up next to your
language on the front page, and it tells people more in one line than a paragraph does.

`highlight` picks the syntax colouring for your sample. Available: `plain`, `x3`, `ruby`,
`clike`, `python`, `wsharp`. Pick whichever is closest, or leave it out. If none of them
fit your syntax, open an issue — adding a grammar is about thirty lines in
`src/lib/highlight/modes.ts`.

`tags` come from a fixed list, so the filters on the front page stay useful. Valid tags:

```txt
esolang            toy                beginner-friendly  scripting
systems            interpreted        compiled           transpiled
jit                stack-based        concatenative      functional
object-oriented    visual             golfing            self-hosting
experimental
```

### Writing a longer page

Anything after the closing `---` is Markdown, and becomes the body of your language's
page. Use it for install instructions, more code, whatever you want:

````markdown
---
name: ExampleLang
tagline: A short line
description: A paragraph.
---

## Install

```bash
npm install -g examplelang
```

ExampleLang compiles to a single binary and has no runtime dependencies.
````

Leave it out entirely and your page just shows the description. That's fine.

## 3. Add your logo

Save it in the same folder as `logo.png`, `logo.webp`, `logo.jpg`, or `logo.svg`.

There's no path to write — it's found by name. Any reasonable size works; the site
generates its own optimised versions, so don't spend time compressing it. Keep the source
file under 300 KB.

No logo? Leave it out. Your plate shows your language's initial instead, which looks
deliberate rather than broken.

## 4. Add a REPL, if you have somewhere to run code

If you host a service that can run your language, people can try it on your page:

```yaml
repl:
  endpoint: https://your-backend.example.com/run
  filename: main.ex
```

The endpoint gets a `POST` with JSON `{ "code": "...", "sources": {} }` and should answer
with `{ "output": "..." }` or `{ "error": "..." }`. It needs to allow cross-origin requests
from `indielangs.org`.

The server is yours, not ours. If it sleeps when idle, that's handled — the page warns
people that the first run takes a moment instead of looking frozen.

## 5. Check it

```bash
npm ci
npm run validate   # checks your file against the schema
npm run dev        # open http://localhost:5173
```

`npm run validate` is the same check that runs on your pull request. If it passes locally,
it passes in CI.

## 6. Open a pull request

That's it. We'll review it, and either merge or leave a comment about what needs changing.

To **update** your language later, edit your own folder. To **remove** it, delete the
folder. Both are one-file pull requests that don't touch anyone else.

## No git, no problem

If the steps above aren't your thing, open an
[add-your-language issue](https://github.com/IndieLangsAssociation/indieLanguageSite/issues/new?template=add-language.yml)
instead. Fill in the boxes, attach your logo, and a maintainer will turn it into a pull
request for you.

## Questions

Ask in [the Discord](https://discord.gg/UvMZrQaMZ2), or open an issue.
