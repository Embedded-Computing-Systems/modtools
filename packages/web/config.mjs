const stage = process.env.SST_STAGE || "dev"

export default {
  url: stage === "production" ? "https://modtools.ai" : `https://${stage}.modtools.ai`,
  console: stage === "production" ? "https://modtools.ai/auth" : `https://${stage}.modtools.ai/auth`,
  email: "contact@anoma.ly",
  socialCard: "https://social-cards.sst.dev",
  github: "https://github.com/Embedded-Computing-Systems/modtools",
  discord: "https://modtools.ai/discord",
  headerLinks: [
    { name: "app.header.home", url: "/" },
    { name: "app.header.docs", url: "/docs/" },
  ],
}
