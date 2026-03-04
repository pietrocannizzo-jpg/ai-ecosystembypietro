// Map card IDs to company domains for logo fetching via logo.dev
export const companyDomains: Record<string, string> = {
  // Defence Tech Startups
  "helsing": "helsing.ai",
  "destinus": "destinus.ch",
  "anduril": "anduril.com",
  "shield-ai": "shield.ai",
  "palantir": "palantir.com",
  "quantum-systems": "quantum-systems.com",
  "stark-defence": "stark.de",
  "arondite": "arondite.com",
  "avalor-ai": "avalor.ai",
  "comand-ai": "comand.ai",

  // Defence Primes
  "leonardo": "leonardo.com",
  "lockheed-martin": "lockheedmartin.com",
  "bae-systems": "baesystems.com",
  "rheinmetall": "rheinmetall.com",
  "rtx-raytheon": "rtx.com",
  "northrop-grumman": "northropgrumman.com",
  "thales": "thalesgroup.com",

  // Space & Satellite
  "spacex-starshield": "spacex.com",
  "defence-sat-jv": "hensoldt.net",
  "project-kuiper": "amazon.com",

  // LLM Chatbots
  "chatgpt-openai": "openai.com",
  "claude-anthropic": "anthropic.com",
  "gemini-google": "deepmind.google",
  "deepseek": "deepseek.com",
  "grok-xai": "x.ai",
  "meta-llama": "meta.com",

  // Coding Tools
  "cursor": "cursor.com",
  "windsurf": "windsurf.com",
  "github-copilot": "github.com",
  "lovable": "lovable.dev",
  "bolt-new": "bolt.new",
  "v0-vercel": "vercel.com",
  "replit": "replit.com",

  // Image Generation
  "midjourney": "midjourney.com",
  "flux": "blackforestlabs.ai",
  "stable-diffusion": "stability.ai",
  "ideogram": "ideogram.ai",

  // Video Generation
  "seedance": "bytedance.com",
  "runway": "runwayml.com",
  "kling": "kuaishou.com",
  "pika": "pika.art",

  // Agents & Infrastructure
  "openclaw": "github.com",
  "moltbook": "moltbook.ai",
  "langchain": "langchain.com",
  "crewai": "crewai.com",
  "autogpt": "agpt.co",
  "n8n": "n8n.io",

  // AI Market Overview
  "ai-market-2026": "openai.com",
};

export function getLogoUrl(cardId: string): string | null {
  const domain = companyDomains[cardId];
  if (!domain) return null;
  return `https://img.logo.dev/${domain}?token=pk_a8zHR90mTsKWPTBBOAJMVA&size=64&format=png`;
}
