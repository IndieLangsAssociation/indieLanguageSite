export type Language = {
  name: string;
  slug: string;
  tagline: string;
  logo: string;
  description: string;
  website?: string;
  discord?: string;
  github?: string;
};

export const languages: Language[] = [
  {
    name: "W++",
    slug: "wpp",
    tagline: "A chaotic Python-style scripting language for .NET",
    logo: "/logos/wpp.png",
    description:
      "W++ is a chaotic scripting language for .NET built for memes, revenge, and everything in between. Powered by sloths.",
    website: "https://wplusplus.org",
    discord: "https://discord.gg/a37hQPPDrp",
    github: "https://github.com/sinisterMage/WPlusPlus",
  },
  {
    name: "X3",
    slug: "x3",
    tagline: "The only bug-free zone is your imagination. Good luck.",
    logo: "/logos/x3.png",
    description:
      "An easy to learn language for new developers! Held together by duct tape and prayers. And yes, it runs.",
    website: "https://x3documentation.neocities.org/",
    discord: "https://discord.gg/rtcBjz5xgc",
     github: "https://github.com/XFydro/x3",
  },
  {
    name: "Summit",
    slug: "summit",
    tagline: "No clue either",
    logo: "/logos/summit.png",
    description:
    "Summit is a high-level language that does weird stuff with ASTs. We think. Ask its creator.",
  },
  {
    name: "ROS",
    slug: "ros",
    tagline: "lua? never heard of it",
    logo: "/logos/ros.webp",
    description:
      "ROS or Ruby on spaces is a modular language designed to be so modular you could redo the expression system during runtime and it would still work. ROS has many sub-sets. Just ROS is for the Python version, ROSL is for the Lua ver, ROSLU is for the Luau version, ROSC is the ROS -> C traspiler. ROS will be the better Lua due to being smaller and the  same speed with almost the same syntax as Lua, but don't like a part of it heck, change it! This. Is. ROS.",
      github: "https://github.com/Backmeet/ruby-on-spaces",
      website: "https://backmeet.github.io/ruby-on-spaces/"
  },
  {
    name: "Citron",
    slug: "citron",
    tagline: "Oh my citron",
    logo: "/logos/citron.png",
    description:
      "A simple, citrusy little language that runs solely on lemons.",
    website: "https://turbowarp.org/1202695164?offscreen&hqpen&fps=250",
    discord: "https://discord.gg/gY9JMQYBg7",
  },
  {
    name: "indX",
    slug: "indx",
    tagline: "idk",
    logo: "/logos/indx.png",
    description:
      "indX is a minimalist experiment with indexes. Nobody knows what it really does, but it’s probably cool.",
    discord: "https://discord.gg/YJ3KTSfMHf",
  },
  {
    name: "Compact",
    slug: "compact",
    tagline: "Logic stripped to its bare operations.",
    logo: "logos/just-compact.png",
    description: "a minimalist language desgined for logic and idk what else to put xDDD"
  },
  {
    name: "ddeLang",
    slug: "ddelang",
    tagline: "Oh my Diamante",
    logo: "/logos/ddeLang.png",
    description: "A shiny programming language designed for building quick scripts with readable syntax.",
    discord: "https://discord.gg/jrwxVAsQDv",
    github: "https://github.com/ddededodediamante/ddehighlight"
  }
];
