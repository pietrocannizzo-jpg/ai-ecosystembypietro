export type FeatureStatus = "shipped" | "beta" | "planned" | "deprecated";
export type NewsType = "release" | "research" | "policy" | "partnership" | "pricing";

export interface AnthropicFeature {
  id: string;
  title: string;
  description: string;
  status: FeatureStatus;
  category: "models" | "api" | "safety" | "products" | "enterprise";
  date: string; // ISO date
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
  { id: "all", label: "All", color: "hsl(var(--accent))" },
  { id: "models", label: "Models", color: "hsl(260 18% 50%)" },
  { id: "api", label: "API", color: "hsl(210 25% 48%)" },
  { id: "products", label: "Products", color: "hsl(168 30% 38%)" },
  { id: "safety", label: "Safety", color: "hsl(350 28% 50%)" },
  { id: "enterprise", label: "Enterprise", color: "hsl(30 50% 50%)" },
] as const;

export const statusConfig: Record<FeatureStatus, { label: string; color: string; bg: string }> = {
  shipped: { label: "Shipped", color: "hsl(150 22% 40%)", bg: "hsl(150 22% 40% / 0.1)" },
  beta: { label: "Beta", color: "hsl(210 25% 48%)", bg: "hsl(210 25% 48% / 0.1)" },
  planned: { label: "Planned", color: "hsl(30 50% 50%)", bg: "hsl(30 50% 50% / 0.1)" },
  deprecated: { label: "Deprecated", color: "hsl(var(--muted-foreground))", bg: "hsl(var(--muted))" },
};

export const features: AnthropicFeature[] = [
  {
    id: "claude-4",
    title: "Claude 4 Opus",
    description: "Next-generation flagship model with significantly improved reasoning, coding, and instruction-following capabilities.",
    status: "shipped",
    category: "models",
    date: "2026-03-15",
    tags: ["model", "flagship", "reasoning"],
    link: "https://www.anthropic.com/news/claude-4",
  },
  {
    id: "claude-4-sonnet",
    title: "Claude 4 Sonnet",
    description: "Balanced model offering strong performance at lower cost and latency than Opus.",
    status: "shipped",
    category: "models",
    date: "2026-03-15",
    tags: ["model", "balanced"],
  },
  {
    id: "claude-4-haiku",
    title: "Claude 4 Haiku",
    description: "Fastest and most affordable Claude 4 model for high-volume tasks.",
    status: "beta",
    category: "models",
    date: "2026-04-01",
    tags: ["model", "fast", "affordable"],
  },
  {
    id: "claude-code",
    title: "Claude Code",
    description: "Agentic coding tool that operates directly in your terminal, understanding your codebase and executing commands.",
    status: "shipped",
    category: "products",
    date: "2026-02-24",
    tags: ["coding", "agent", "terminal"],
    link: "https://www.anthropic.com/claude-code",
  },
  {
    id: "mcp",
    title: "Model Context Protocol (MCP)",
    description: "Open protocol for connecting AI assistants to external data sources and tools in a standardized way.",
    status: "shipped",
    category: "api",
    date: "2025-11-25",
    tags: ["protocol", "open-source", "integrations"],
    link: "https://modelcontextprotocol.io",
  },
  {
    id: "tool-use",
    title: "Tool Use (Function Calling)",
    description: "Enable Claude to interact with external tools and APIs through structured function calls.",
    status: "shipped",
    category: "api",
    date: "2024-05-30",
    tags: ["api", "tools", "function-calling"],
  },
  {
    id: "computer-use",
    title: "Computer Use",
    description: "Claude can interact with computer interfaces — clicking, typing, and navigating like a human user.",
    status: "shipped",
    category: "products",
    date: "2025-10-29",
    tags: ["agent", "automation", "computer"],
  },
  {
    id: "citations-api",
    title: "Citations API",
    description: "Responses include precise citations pointing back to source documents for verifiability.",
    status: "shipped",
    category: "api",
    date: "2025-03-15",
    tags: ["api", "citations", "grounding"],
  },
  {
    id: "extended-thinking",
    title: "Extended Thinking",
    description: "Claude can use a scratchpad to reason through complex problems step-by-step before responding.",
    status: "shipped",
    category: "models",
    date: "2025-02-24",
    tags: ["reasoning", "chain-of-thought"],
  },
  {
    id: "prompt-caching",
    title: "Prompt Caching",
    description: "Cache frequently used prompt prefixes to reduce latency and costs by up to 90%.",
    status: "shipped",
    category: "api",
    date: "2024-08-14",
    tags: ["api", "performance", "cost"],
  },
  {
    id: "batch-api",
    title: "Message Batches API",
    description: "Process large volumes of messages asynchronously at 50% reduced cost.",
    status: "shipped",
    category: "api",
    date: "2024-09-24",
    tags: ["api", "batch", "cost"],
  },
  {
    id: "artifacts",
    title: "Artifacts",
    description: "Claude can create and render interactive code, documents, and visualizations directly in conversation.",
    status: "shipped",
    category: "products",
    date: "2024-06-20",
    tags: ["product", "interactive", "claude.ai"],
  },
  {
    id: "projects",
    title: "Projects",
    description: "Organize conversations, files, and custom instructions into reusable project workspaces.",
    status: "shipped",
    category: "products",
    date: "2024-09-04",
    tags: ["product", "organization", "claude.ai"],
  },
  {
    id: "enterprise-sso",
    title: "Enterprise SSO & SCIM",
    description: "Single sign-on and automated user provisioning for enterprise deployments.",
    status: "shipped",
    category: "enterprise",
    date: "2024-04-01",
    tags: ["enterprise", "security", "sso"],
  },
  {
    id: "claude-for-sheets",
    title: "Claude for Google Sheets",
    description: "Use Claude directly within Google Sheets for data analysis, classification, and content generation.",
    status: "shipped",
    category: "products",
    date: "2024-03-01",
    tags: ["integration", "google", "sheets"],
  },
  {
    id: "token-counting",
    title: "Token Counting API",
    description: "Count tokens in messages before sending them to accurately predict costs.",
    status: "shipped",
    category: "api",
    date: "2024-11-14",
    tags: ["api", "tokens", "cost"],
  },
  {
    id: "pdf-support",
    title: "PDF & Image Understanding",
    description: "Claude can analyze PDFs, images, charts, and documents with high accuracy.",
    status: "shipped",
    category: "models",
    date: "2024-10-01",
    tags: ["multimodal", "vision", "documents"],
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
    id: "ios-android-app",
    title: "Mobile Apps (iOS & Android)",
    description: "Native Claude apps for iPhone, iPad, and Android with full feature parity.",
    status: "shipped",
    category: "products",
    date: "2025-01-01",
    tags: ["mobile", "ios", "android"],
  },
  {
    id: "webhooks",
    title: "Webhooks for Batch API",
    description: "Get notified automatically when batch processing jobs complete.",
    status: "beta",
    category: "api",
    date: "2026-02-01",
    tags: ["api", "webhooks", "notifications"],
  },
  {
    id: "multi-agent",
    title: "Multi-Agent Orchestration",
    description: "Framework for coordinating multiple Claude instances working together on complex tasks.",
    status: "planned",
    category: "api",
    date: "2026-06-01",
    tags: ["agents", "orchestration", "framework"],
  },
  {
    id: "fine-tuning",
    title: "Fine-Tuning API",
    description: "Custom model fine-tuning for enterprise customers to specialize Claude on domain-specific tasks.",
    status: "planned",
    category: "enterprise",
    date: "2026-06-01",
    tags: ["enterprise", "fine-tuning", "customization"],
  },
];

export const news: AnthropicNews[] = [
  {
    id: "claude-4-launch",
    title: "Introducing Claude 4",
    summary: "Claude 4 sets a new standard for AI assistants with breakthrough reasoning, multilingual, and agentic capabilities.",
    type: "release",
    date: "2026-03-15",
    tags: ["claude-4", "launch"],
    link: "https://www.anthropic.com/news/claude-4",
  },
  {
    id: "series-d",
    title: "Anthropic raises $2B Series D",
    summary: "New funding to accelerate AI safety research and scale Claude to billions of users worldwide.",
    type: "partnership",
    date: "2026-01-15",
    tags: ["funding", "growth"],
  },
  {
    id: "claude-code-launch",
    title: "Claude Code: AI in your terminal",
    summary: "A new agentic coding tool that understands your entire codebase and executes complex multi-step tasks.",
    type: "release",
    date: "2026-02-24",
    tags: ["claude-code", "coding"],
    link: "https://www.anthropic.com/claude-code",
  },
  {
    id: "mcp-adoption",
    title: "MCP adopted by major IDEs and tools",
    summary: "The Model Context Protocol becomes the de facto standard for AI tool integration, adopted by VS Code, JetBrains, and more.",
    type: "partnership",
    date: "2026-02-01",
    tags: ["mcp", "ecosystem"],
  },
  {
    id: "rsp-update",
    title: "Updated Responsible Scaling Policy",
    summary: "Anthropic publishes v3 of its Responsible Scaling Policy, introducing new evaluation frameworks for frontier models.",
    type: "policy",
    date: "2026-01-20",
    tags: ["safety", "policy"],
    link: "https://www.anthropic.com/research/rsp",
  },
  {
    id: "api-pricing-cut",
    title: "API pricing reduced by 40%",
    summary: "Significant price reductions across all Claude models, making AI more accessible for developers.",
    type: "pricing",
    date: "2026-03-01",
    tags: ["pricing", "api"],
  },
  {
    id: "constitutional-ai-2",
    title: "Constitutional AI 2.0 paper",
    summary: "New research paper detailing improvements to Anthropic's core alignment technique with multi-objective optimization.",
    type: "research",
    date: "2026-02-15",
    tags: ["research", "safety", "alignment"],
  },
  {
    id: "extended-thinking-ga",
    title: "Extended Thinking now generally available",
    summary: "Chain-of-thought reasoning is now available across all Claude 3.5 and Claude 4 models via the API.",
    type: "release",
    date: "2025-06-01",
    tags: ["extended-thinking", "api"],
  },
];
