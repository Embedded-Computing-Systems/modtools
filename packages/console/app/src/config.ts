/**
 * Application-wide constants and configuration
 */
export const config = {
  // Base URL
  baseUrl: "https://modtools.ai",

  // GitHub
  github: {
    repoUrl: "https://github.com/Embedded-Computing-Systems/modtools",
    starsFormatted: {
      compact: "120K",
      full: "120,000",
    },
  },

  // Social links
  social: {
    twitter: "https://x.com/modtools",
    discord: "https://discord.gg/modtools",
  },

  // Static stats (used on landing page)
  stats: {
    contributors: "800",
    commits: "10,000",
    monthlyUsers: "5M",
  },
} as const
