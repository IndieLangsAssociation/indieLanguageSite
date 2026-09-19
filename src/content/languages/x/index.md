---
# yaml-language-server: $schema=../../language.schema.json
name: X
tagline: "What kind of transpilation is this???"
description: >-
  X is a transpiled language that goes from X to a Haxe program to C to gcc to an
  actual binary.
tags: [transpiled, compiled, object-oriented]
by:
  name: Crzy
links:
  website: https://crz.network:21212/x-lang/
  discord: https://discord.gg/NxFePPqZgA
logoFit: fill
highlight: clike
sample: |
  including "x.x";
  entry Hello;

  class Hello {
      public method new() [
          X:print(XString("Hello, World!"));
      ]
  }
repl:
  endpoint: https://crz.network:21212/x-lang/run.php
  filename: main.x
---
