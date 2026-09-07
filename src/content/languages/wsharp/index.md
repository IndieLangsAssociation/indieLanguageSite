---
# yaml-language-server: $schema=../../language.schema.json
name: W#
tagline: "A compiled language built on multiple dispatch, for services, tools and long-running processes."
description: >-
  Multiple dispatch is a better way to organise a program than either classes or a
  growing switch: a special case is a function you add, not a branch you insert into
  something that already works. W# compiles that idea. Dispatch resolves at compile
  time wherever the types allow, types are inferred rather than declared and checked
  across the whole program before it builds, and values are unboxed.
tags: [compiled, systems]
by:
  name: Ofek Bickel
  github: sinisterMage
links:
  github: https://github.com/sinisterMage/WSharp
highlight: wsharp
sample: |
  fn add(a, b) { return a + b; }
---

Zig-flavoured, with one deliberate departure: **type annotations are optional
everywhere.** They are checked when written and inferred when not, so
`fn add(a, b) { return a + b; }` has a signature rather than a hope.

## Adding a case means adding a function

```wsharp
const http = @import("std/http");

fn render(r: Request, s: http.Status)      str { return "HTTP/1.1 500 Internal Server Error"; }
fn render(r: Request, s: http.Status2xx)   str { return "HTTP/1.1 200 OK"; }
fn render(r: Request, s: http.Status4xx)   str { return "HTTP/1.1 400 Bad Request"; }
fn render(r: Request, s: http.NotFound404) str { return "HTTP/1.1 404 Not Found"; }
fn render(r: Request, s: http.Teapot418)   str { return "HTTP/1.1 418 I'm a teapot"; }

print(render(req, http.NotFound404));
```

Nothing existing is edited, and the compiler rejects a new overload that would be
ambiguous with an old one rather than silently changing which code runs. Where
inference pins the argument types, the call lowers to an ordinary direct call with
no dispatch code at all.

## What else is in there

- Hindley-Milner inference over the whole program. An ambiguous pair of overloads,
  an error raised outside a declared error set, and a function that can reach the
  end of its body without returning are all compile errors.
- `!T` carries the error *set*, so the `e` bound by `catch |e|` is worth testing
  against.
- Reference counting with a concurrent mark trace for cycles, and compaction that
  runs while the program does. The longest pause measured 40 microseconds on
  120,000 live objects.
- Workers share no heap. Values cross as bytes, so there is no shared collector and
  no data race to write.
- A standard library written in the language — SHA-2, ChaCha20-Poly1305, X25519,
  X.509 and TLS 1.3 are all `.ws` files compiled with your program.

W# is young and its standard library is small. What's there is tested end to end.

## Try it

```sh
git clone https://github.com/sinisterMage/WSharp
cd WSharp
cargo run -p wsharp-cli -- run examples/status.ws
```

Needs Rust 1.95+ and a C toolchain. On NixOS, `nix-shell` provides both.
