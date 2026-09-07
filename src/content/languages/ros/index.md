---
# yaml-language-server: $schema=../../language.schema.json
name: ROS
tagline: "lua? never heard of it"
description: >-
  ROS or Ruby on spaces is a modular language designed to be so modular you could
  redo the expression system during runtime and it would still work. ROS has many
  sub-sets. Just ROS is for the Python version, ROSL is for the Lua ver, ROSLU is
  for the Luau version, ROSC is the ROS -> C transpiler. ROS will be the better Lua
  due to being smaller and the same speed with almost the same syntax as Lua, but
  don't like a part of it heck, change it! This. Is. ROS.
tags: [scripting, interpreted, experimental]
by:
  name: Backmeet
  github: Backmeet
links:
  website: https://backmeet.github.io/ruby-on-spaces/
  github: https://github.com/Backmeet/ruby-on-spaces
highlight: ruby
sample: |
  x = 10
  y = 20
  z = x + y
  print("Sum:", z)
repl:
  endpoint: https://indielangsbackend.onrender.com/api/run/ROS
  filename: main.ros
---
