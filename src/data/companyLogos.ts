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
  "chatgpt-openai": "openai.com",
  "perplexity": "perplexity.ai",
  "claude-anthropic": "anthropic.com",
  "gemini-google": "deepmind.google",
  "deepseek": "deepseek.com",
  "grok-xai": "x.ai",
  "meta-llama": "meta.ai",
  "mistral": "mistral.ai",
  "cohere": "cohere.com",
  "microsoft-copilot": "microsoft.com",

  // Coding Tools
  "google-antigravity": "antigravity.google",
  "cursor": "cursor.com",
  "windsurf": "codeium.com",
  "github-copilot": "github.com",
  "lovable": "lovable.dev",
  "bolt-new": "bolt.new",
  "v0-vercel": "vercel.com",
  "replit": "replit.com",
  "claude-code": "anthropic.com",
  "tabnine": "tabnine.com",
  "amazon-q": "aws.amazon.com",
  "codex-cli": "openai.com",

  // Image Generation
  "midjourney": "midjourney.com",
  "flux": "blackforestlabs.ai",
  "stable-diffusion": "stability.ai",
  "ideogram": "ideogram.ai",
  "dalle": "openai.com",
  "leonardo-ai": "leonardo.ai",
  "adobe-firefly": "adobe.com",
  "magnific-ai": "magnific.ai",
  "krea-ai": "krea.ai",
  "freepik-ai": "freepik.com",

  // Video Generation
  "seedance": "bytedance.com",
  "runway": "runwayml.com",
  "kling": "klingai.com",
  "pika": "pika.art",
  "veo": "deepmind.google",
  "luma": "lumalabs.ai",
  "hailuoai": "hailuoai.video",
  "sora": "openai.com",
  "synthesia": "synthesia.io",
  "heygen": "heygen.com",
  "invideo-ai": "invideo.io",
  "viggle": "viggle.ai",
  "pixverse": "pixverse.ai",

  // Audio & Music
  "elevenlabs": "elevenlabs.io",
  "suno": "suno.com",
  "udio": "udio.com",
  "whisper": "openai.com",
  "descript": "descript.com",
  "murf-ai": "murf.ai",

  // Agents & Infrastructure
  "langchain": "langchain.com",
  "crewai": "crewai.com",
  "autogpt": "agpt.co",
  "mcp-protocol": "modelcontextprotocol.io",

  // Automations
  "zapier": "zapier.com",
  "make": "make.com",
  "n8n": "n8n.io",

  // AI-Powered Apps
  "superhuman": "superhuman.com",
  "notion-ai": "notion.so",
  "gamma": "gamma.app",
  "napkin-ai": "napkin.ai",
  "canva-ai": "canva.com",

  // AI Market Overview
  "ai-market-2026": "openai.com",

  // AI Finance & Trading
  "vertus": "vertus.fi",
  "alphasense": "alpha-sense.com",
  "ramp": "ramp.com",

  // AI Healthcare
  "hippocratic-ai": "hippocratic.ai",
  "recursion-pharma": "recursion.com",

  // AI Industry & Agriculture
  "cowai": "cowai.com",
  "john-deere-ai": "deere.com",

  // AI Legal
  "harvey-ai": "harvey.ai",

  // AI Search
  "you-com": "you.com",

  // AI Assistants
  "poe": "poe.com",

  // Apple Intelligence
  "apple-intelligence": "apple.com",

  // New Coding Assistants
  "augment-code": "augmentcode.com",
  "devin": "devin.ai",
  "jetbrains-ai": "jetbrains.com",
  "aider": "aider.chat",
  "qodo": "qodo.ai",
  "openhands": "openhands.dev",

  // New AI Search
  "phind": "phind.com",
  "kagi": "kagi.com",
  "exa": "exa.ai",

  // New AI Productivity
  "jasper": "jasper.ai",
  "grammarly": "grammarly.com",
  "copy-ai": "copy.ai",
  "writer": "writer.com",
  "glean": "glean.com",
  "otter-ai": "otter.ai",

  // New AI Assistants
  "character-ai": "character.ai",
  "le-chat": "mistral.ai",

  // New Agents & Infra
  "hugging-face": "huggingface.co",
  "pinecone": "pinecone.io",
  "weights-biases": "wandb.ai",
  "replicate": "replicate.com",
  "together-ai": "together.ai",
  "scale-ai": "scale.com",

  // New AI Design
  "framer-ai": "framer.com",
  "relume": "relume.io",

  // AI Sales
  "gong": "gong.io",
  "clay": "clay.com",
  "11x-ai": "11x.ai",
  "artisan": "artisan.co",

  // AI Cybersecurity
  "darktrace": "darktrace.com",
  "abnormal-security": "abnormalsecurity.com",
  "wiz": "wiz.io",

  // AI Education
  "khanmigo": "khanmigo.ai",
  "duolingo-max": "duolingo.com",

  // AI Hardware
  "nvidia-ai": "nvidia.com",
  "sambanova": "sambanova.ai",
  "groq": "groq.com",
  "cerebras": "cerebras.ai",

  // AI Data
  "databricks": "databricks.com",
  "snowflake-cortex": "snowflake.com",
  "julius-ai": "julius.ai",

  // AI HR
  "mercor": "mercor.com",
  "eightfold-ai": "eightfold.ai",
  "elise-ai": "eliseai.com",

  // AI Industry
  "figure-ai": "figure.ai",
  "boston-dynamics": "bostondynamics.com",

  // AI Legal
  "casetext": "casetext.com",
};

// Use higher quality Google favicon V2 API
export function getLogoUrl(cardId: string): string | null {
  // Check local overrides first
  if (localLogos[cardId]) return localLogos[cardId];
  const domain = companyDomains[cardId];
  if (!domain) return null;
  // Higher quality favicon API with fallbacks
  return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`;
}
