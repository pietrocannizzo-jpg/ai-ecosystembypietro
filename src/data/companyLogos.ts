import openclawLogo from "@/assets/logos/openclaw.png";
import moltbookLogo from "@/assets/logos/moltbook.png";

// Local logo overrides (imported images)
const localLogos: Record<string, string> = {
  "openclaw": openclawLogo,
  "moltbook": moltbookLogo,
};

// Map card IDs to company domains for logo fetching
export const companyDomains: Record<string, string> = {
  // LLM Chatbots
  "chatgpt-openai": "chatgpt.com",
  "claude-anthropic": "claude.ai",
  "gemini-google": "gemini.google.com",
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
  "langchain": "langchain.com",
  "crewai": "crewai.com",
  "autogpt": "agpt.co",
  "n8n": "n8n.io",

  // AI Market Overview
  "ai-market-2026": "openai.com",
};

export function getLogoUrl(cardId: string): string | null {
  // Check local overrides first
  if (localLogos[cardId]) return localLogos[cardId];
  const domain = companyDomains[cardId];
  if (!domain) return null;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}
