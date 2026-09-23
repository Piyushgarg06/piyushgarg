export const data = {
  name: {
    line1: "PIYUSH",
    line2: "GARG",
  },

  role: "AI Engineer · Builder",

  subtitle:
    "Building developer tools that think in graphs instead of documents.",

  about: {
    bio: [
      "I spend most of my time building AI systems and developer tools that start as 'what if...' ideas and usually grow into much bigger engineering problems than I planned. I'm drawn to projects that require thinking about architecture, reasoning, and long-term design rather than just wiring APIs together.",
      "Outside of programming, I'm probably watching Formula 1 race analysis frame by frame, comparing lap times by milliseconds. Music is almost always playing in the background — usually Sabrina Carpenter, Laufey, or Lana Del Rey. Every now and then I'll disappear for an anime binge before diving back into code.",
      "Right now I'm building Synapse, exploring multi-agent AI systems, and generally chasing ideas that are difficult enough that I don't already know how they'll end. I'm still early in my career, but that's part of the fun. I care more about learning by building ambitious things than collecting finished projects, and I'm looking for opportunities where I can work on genuinely hard engineering problems alongside people who enjoy solving them just as much.",
    ],
    details: [
      {
        label: "Currently",
        value: "Building Synapse & Exploring Multi-Agent Systems",
      },
      { label: "Based in", value: "Delhi, India" },
      { label: "Looking for", value: "AI / Machine Learning Internships" },
      {
        label: "Stack",
        value: "Python, PyTorch, React, Ollama, Knowledge Graphs",
      },
    ],
  },

  projects: [
    {
      number: "01",
      name: "Synapse",
      problem: "Git history and docs are stored as flat files — reasoning about a codebase requires reading everything from scratch each time.",
      description:
        "Local-first repository intelligence system that transforms Git history and docs into searchable knowledge graphs.",
      result: "Enables semantic queries over a codebase with no cloud dependency.",
      tags: ["Python", "Ollama", "Knowledge Graphs", "Git"],
      github: "https://github.com/Piyushgarg06/SynapseAI",
    },
    {
      number: "02",
      name: "Diffusion Calorimeter Generation",
      problem: "High-energy physics simulations require expensive, sparse detector data that is slow and costly to generate.",
      description:
        "Diffusion models for sparse calorimeter detector data — generative modeling for high-energy physics simulations.",
      result: "Produces statistically valid calorimeter shower samples at a fraction of simulation cost.",
      tags: ["PyTorch", "Diffusion Models", "Deep Learning", "Physics AI"],
      github:
        "https://github.com/Piyushgarg06/diffusion-calorimeter-generation",
    },
  ],

  experience: [
    {
      role: "Open Source Contributor",
      org: "Various",
      period: "2024 — Present",
      description:
        "Contributing to AI/ML tooling and developer infrastructure projects.",
    },
  ],

  contact: {
    email: "erpiyushgarg17@gmail.com",
    github: "https://github.com/Piyushgarg06",
    linkedin: "https://linkedin.com/in/piyushgargtech",
  },
};

/* Spring presets — use these everywhere, never inline spring configs */
export const springs = {
  gentle:  { type: "spring", stiffness: 60,  damping: 20, mass: 1   },
  snappy:  { type: "spring", stiffness: 200, damping: 28, mass: 0.8 },
  precise: { type: "spring", stiffness: 300, damping: 35, mass: 0.5 },
};
