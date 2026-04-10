export type FeatureStatus = "shipped" | "beta" | "planned" | "deprecated";
export type NewsType = "release" | "research" | "policy" | "partnership" | "pricing" | "announcement";

export interface AnthropicFeature {
  id: string;
  title: string;
  description: string;
  status: FeatureStatus;
  category: "models" | "api" | "safety" | "products" | "enterprise";
  date: string;
  tags: string[];
  link?: string;
}

export interface AnthropicNews {
  id: string;
  title: string;
  summary: string;
  type: NewsType;
  date: string;
  link?: string;
  tags: string[];
}

export const featureCategories = [
  { id: "all", label: "All" },
  { id: "models", label: "Models" },
  { id: "api", label: "API" },
  { id: "products", label: "Products" },
  { id: "safety", label: "Safety" },
  { id: "enterprise", label: "Enterprise" },
] as const;

export const statusConfig: Record<FeatureStatus, { label: string; dotColor: string }> = {
  shipped: { label: "Shipped", dotColor: "#1a7f37" },
  beta: { label: "Beta", dotColor: "#9a6700" },
  planned: { label: "Planned", dotColor: "#656d76" },
  deprecated: { label: "Deprecated", dotColor: "#cf222e" },
};

export const features: AnthropicFeature[] = [
  // ─── Models ───
  {
    id: "opus-4-6",
    title: "Claude Opus 4.6",
    description: "Industry-leading model across agentic coding, computer use, tool use, search, and finance.",
    status: "shipped",
    category: "models",
    date: "2026-02-05",
    tags: ["model", "flagship"],
    link: "https://www.anthropic.com/news/claude-opus-4-6",
  },
  {
    id: "sonnet-4-6",
    title: "Claude Sonnet 4.6",
    description: "Frontier performance across coding, agents, and professional work at scale.",
    status: "shipped",
    category: "models",
    date: "2026-02-17",
    tags: ["model", "balanced"],
    link: "https://www.anthropic.com/news/claude-sonnet-4-6",
  },
  {
    id: "claude-3-5-sonnet",
    title: "Claude 3.5 Sonnet",
    description: "Major leap in intelligence, coding, and reasoning at Sonnet-tier pricing.",
    status: "shipped",
    category: "models",
    date: "2024-06-20",
    tags: ["model", "balanced"],
  },
  {
    id: "claude-3-5-haiku",
    title: "Claude 3.5 Haiku",
    description: "Fastest model in the Claude 3.5 family — ideal for high-throughput, cost-sensitive tasks.",
    status: "shipped",
    category: "models",
    date: "2024-10-22",
    tags: ["model", "fast"],
  },
  {
    id: "extended-thinking",
    title: "Extended Thinking",
    description: "Claude reasons step-by-step in a scratchpad before responding, dramatically improving complex problem-solving.",
    status: "shipped",
    category: "models",
    date: "2025-02-24",
    tags: ["reasoning", "chain-of-thought"],
  },
  {
    id: "pdf-vision",
    title: "PDF & Image Understanding",
    description: "Claude can analyze PDFs, images, charts, and scanned documents with high accuracy.",
    status: "shipped",
    category: "models",
    date: "2024-10-01",
    tags: ["multimodal", "vision"],
  },

  // ─── Products ───
  {
    id: "claude-code",
    title: "Claude Code",
    description: "Agentic coding tool that operates directly in your terminal, understanding your codebase and executing commands.",
    status: "shipped",
    category: "products",
    date: "2025-02-24",
    tags: ["coding", "agent", "terminal"],
    link: "https://www.anthropic.com/claude-code",
  },
  {
    id: "computer-use",
    title: "Computer Use",
    description: "Claude can interact with computer interfaces — clicking, typing, and navigating like a human user.",
    status: "shipped",
    category: "products",
    date: "2024-10-29",
    tags: ["agent", "automation"],
  },
  {
    id: "artifacts",
    title: "Artifacts",
    description: "Create and render interactive code, documents, and visualizations directly in conversation.",
    status: "shipped",
    category: "products",
    date: "2024-06-20",
    tags: ["interactive", "claude.ai"],
  },
  {
    id: "projects",
    title: "Projects",
    description: "Organize conversations, files, and custom instructions into reusable project workspaces.",
    status: "shipped",
    category: "products",
    date: "2024-09-04",
    tags: ["organization", "claude.ai"],
  },
  {
    id: "custom-styles",
    title: "Custom Styles",
    description: "Adjust Claude's communication style — formal, concise, explanatory — across all conversations.",
    status: "shipped",
    category: "products",
    date: "2025-01-01",
    tags: ["customization", "claude.ai"],
  },
  {
    id: "ios-android",
    title: "Mobile Apps (iOS & Android)",
    description: "Native Claude apps for iPhone, iPad, and Android with full feature parity.",
    status: "shipped",
    category: "products",
    date: "2024-05-01",
    tags: ["mobile", "ios", "android"],
  },
  {
    id: "claude-sheets",
    title: "Claude for Google Sheets",
    description: "Use Claude directly within Google Sheets for data analysis, classification, and content generation.",
    status: "shipped",
    category: "products",
    date: "2024-03-01",
    tags: ["integration", "sheets"],
  },
  {
    id: "claude-space-to-think",
    title: "Claude: A Space to Think",
    description: "Claude will remain ad-free. Advertising incentives are incompatible with a genuinely helpful AI assistant.",
    status: "shipped",
    category: "products",
    date: "2026-02-04",
    tags: ["product", "trust"],
    link: "https://www.anthropic.com/news/claude-is-a-space-to-think",
  },

  // ─── API ───
  {
    id: "mcp",
    title: "Model Context Protocol (MCP)",
    description: "Open protocol for connecting AI assistants to external data sources and tools in a standardized way.",
    status: "shipped",
    category: "api",
    date: "2024-11-25",
    tags: ["protocol", "open-source"],
    link: "https://modelcontextprotocol.io",
  },
  {
    id: "tool-use",
    title: "Tool Use (Function Calling)",
    description: "Enable Claude to interact with external tools and APIs through structured function calls.",
    status: "shipped",
    category: "api",
    date: "2024-05-30",
    tags: ["tools", "function-calling"],
  },
  {
    id: "citations-api",
    title: "Citations API",
    description: "Responses include precise citations pointing back to source documents for verifiability.",
    status: "shipped",
    category: "api",
    date: "2025-03-15",
    tags: ["citations", "grounding"],
  },
  {
    id: "prompt-caching",
    title: "Prompt Caching",
    description: "Cache frequently used prompt prefixes to reduce latency and costs by up to 90%.",
    status: "shipped",
    category: "api",
    date: "2024-08-14",
    tags: ["performance", "cost"],
  },
  {
    id: "batch-api",
    title: "Message Batches API",
    description: "Process large volumes of messages asynchronously at 50% reduced cost.",
    status: "shipped",
    category: "api",
    date: "2024-09-24",
    tags: ["batch", "cost"],
  },
  {
    id: "token-counting",
    title: "Token Counting API",
    description: "Count tokens in messages before sending them to accurately predict costs.",
    status: "shipped",
    category: "api",
    date: "2024-11-14",
    tags: ["tokens", "cost"],
  },
  {
    id: "multi-agent",
    title: "Multi-Agent Orchestration",
    description: "Framework for coordinating multiple Claude instances working together on complex tasks.",
    status: "shipped",
    category: "api",
    date: "2025-05-01",
    tags: ["agents", "orchestration"],
  },
  {
    id: "webhooks",
    title: "Webhooks for Batch API",
    description: "Get notified automatically when batch processing jobs complete.",
    status: "beta",
    category: "api",
    date: "2026-02-01",
    tags: ["webhooks", "notifications"],
  },

  // ─── Safety ───
  {
    id: "rsp",
    title: "Responsible Scaling Policy",
    description: "Framework for safely developing increasingly capable AI systems with defined capability thresholds.",
    status: "shipped",
    category: "safety",
    date: "2023-09-19",
    tags: ["policy", "scaling"],
    link: "https://www.anthropic.com/research/rsp",
  },
  {
    id: "constitutional-ai",
    title: "Constitutional AI",
    description: "Core alignment technique using a set of principles to guide model behavior without human feedback on every output.",
    status: "shipped",
    category: "safety",
    date: "2023-05-09",
    tags: ["alignment", "research"],
  },

  // ─── Enterprise ───
  {
    id: "enterprise-sso",
    title: "Enterprise SSO & SCIM",
    description: "Single sign-on and automated user provisioning for enterprise deployments.",
    status: "shipped",
    category: "enterprise",
    date: "2024-04-01",
    tags: ["security", "sso"],
  },
  {
    id: "fine-tuning",
    title: "Fine-Tuning API",
    description: "Custom model fine-tuning for enterprise customers to specialize Claude on domain-specific tasks.",
    status: "planned",
    category: "enterprise",
    date: "2026-06-01",
    tags: ["fine-tuning", "customization"],
  },
  {
    id: "vercept-acquisition",
    title: "Vercept Acquisition (Computer Use)",
    description: "Anthropic acquires Vercept to advance Claude's computer use capabilities with specialized vision models.",
    status: "shipped",
    category: "enterprise",
    date: "2026-02-25",
    tags: ["acquisition", "computer-use"],
    link: "https://www.anthropic.com/news/acquires-vercept",
  },
];

export const news: AnthropicNews[] = [
  {
    id: "glasswing",
    title: "Project Glasswing",
    summary: "A new initiative bringing together AWS, Anthropic, Apple, Broadcom, Cisco, CrowdStrike, Google, JPMorganChase, Linux Foundation, Microsoft, NVIDIA, and Palo Alto Networks to secure the world's most critical software.",
    type: "announcement",
    date: "2026-04-07",
    tags: ["security", "partnership"],
    link: "https://www.anthropic.com/glasswing",
  },
  {
    id: "google-broadcom",
    title: "Partnership with Google and Broadcom for next-gen compute",
    summary: "Anthropic expands partnership with Google and Broadcom for multiple gigawatts of next-generation compute capacity.",
    type: "partnership",
    date: "2026-04-06",
    tags: ["compute", "infrastructure"],
    link: "https://www.anthropic.com/news/google-broadcom-partnership-compute",
  },
  {
    id: "australia-mou",
    title: "Australian government MOU for AI safety",
    summary: "Australian government and Anthropic sign memorandum of understanding for AI safety and research collaboration.",
    type: "policy",
    date: "2026-03-31",
    tags: ["government", "safety"],
    link: "https://www.anthropic.com/news/australia-MOU",
  },
  {
    id: "81k-interviews",
    title: "What 81,000 people want from AI",
    summary: "The largest multilingual qualitative study of its kind — Claude users share how they use AI, what they dream it could do, and what they fear.",
    type: "research",
    date: "2026-03-18",
    tags: ["research", "users"],
    link: "https://www.anthropic.com/81k-interviews",
  },
  {
    id: "partner-network",
    title: "Claude Partner Network — $100M investment",
    summary: "Anthropic invests $100 million into the Claude Partner Network to accelerate enterprise AI adoption.",
    type: "partnership",
    date: "2026-03-12",
    tags: ["partners", "investment"],
    link: "https://www.anthropic.com/news/claude-partner-network",
  },
  {
    id: "anthropic-institute",
    title: "Introducing The Anthropic Institute",
    summary: "A new research institute focused on AI safety, interpretability, and the long-term societal impacts of AI systems.",
    type: "announcement",
    date: "2026-03-11",
    tags: ["research", "institute"],
    link: "https://www.anthropic.com/news/the-anthropic-institute",
  },
  {
    id: "sydney-office",
    title: "Sydney — fourth office in Asia-Pacific",
    summary: "Anthropic expands with a new office in Sydney, its fourth location in the Asia-Pacific region.",
    type: "announcement",
    date: "2026-03-10",
    tags: ["expansion", "apac"],
    link: "https://www.anthropic.com/news/sydney-fourth-office-asia-pacific",
  },
  {
    id: "mozilla-firefox",
    title: "Partnering with Mozilla to improve Firefox security",
    summary: "Anthropic partners with Mozilla to use Claude for automated security analysis of Firefox's codebase.",
    type: "partnership",
    date: "2026-03-06",
    tags: ["security", "mozilla"],
    link: "https://www.anthropic.com/news/mozilla-firefox-security",
  },
  {
    id: "sonnet-4-6-news",
    title: "Introducing Claude Sonnet 4.6",
    summary: "Sonnet 4.6 delivers frontier performance across coding, agents, and professional work at scale.",
    type: "release",
    date: "2026-02-17",
    tags: ["model", "sonnet"],
    link: "https://www.anthropic.com/news/claude-sonnet-4-6",
  },
  {
    id: "opus-4-6-news",
    title: "Introducing Claude Opus 4.6",
    summary: "Upgrading our smartest model. Across agentic coding, computer use, tool use, search, and finance, Opus 4.6 is industry-leading.",
    type: "release",
    date: "2026-02-05",
    tags: ["model", "opus"],
    link: "https://www.anthropic.com/news/claude-opus-4-6",
  },
  {
    id: "ad-free",
    title: "Claude is a space to think",
    summary: "Claude will remain ad-free. Advertising incentives are incompatible with a genuinely helpful AI assistant.",
    type: "announcement",
    date: "2026-02-04",
    tags: ["trust", "product"],
    link: "https://www.anthropic.com/news/claude-is-a-space-to-think",
  },
  {
    id: "vercept-news",
    title: "Anthropic acquires Vercept",
    summary: "Acquisition to advance Claude's computer use capabilities with specialized vision models.",
    type: "announcement",
    date: "2026-02-25",
    tags: ["acquisition"],
    link: "https://www.anthropic.com/news/acquires-vercept",
  },
];
