export interface SubProduct {
  name: string;
  icon: string;
  description: string;
  releaseDate?: string;
}

export interface TimelineEntry {
  date: string;
  description: string;
  type: "launch" | "update" | "funding" | "milestone" | "model" | "product" | "api" | "safety" | "business" | "partnership" | "research";
}

export interface CardData {
  id: string;
  title: string;
  icon: string;
  category: string;
  subcategory: string;
  color: string;
  summary: string;
  tags: string[];
  links: string[];
  subProducts: SubProduct[];
  timeline: TimelineEntry[];
  positionX: number;
  positionY: number;
}

export interface CategoryDef {
  id: string;
  label: string;
  color: string;
  side: "left" | "right";
  description: string;
}

export const categories: CategoryDef[] = [
  { id: "llm-chatbots", label: "LLM Chatbots", color: "#6366f1", side: "left", description: "AI assistants & large language models powering conversational AI, reasoning, and content generation" },
  { id: "coding-tools", label: "Coding Tools", color: "#06b6d4", side: "left", description: "AI-powered IDEs, code generators, and app builders transforming software development" },
  { id: "image-gen", label: "Image Generation", color: "#d946ef", side: "left", description: "Text-to-image AI models creating photorealistic art, designs, and visual content" },
  { id: "video-gen", label: "Video Generation", color: "#10b981", side: "left", description: "AI video creation tools producing cinema-grade footage from text and image prompts" },
  { id: "audio-music", label: "Audio & Music", color: "#ec4899", side: "right", description: "AI-powered voice synthesis, music generation, transcription, and audio editing tools" },
  { id: "agents-infra", label: "Agents & Infrastructure", color: "#f43f5e", side: "right", description: "Autonomous AI agents, orchestration frameworks, and multi-agent collaboration platforms" },
  { id: "automations", label: "Automations", color: "#f97316", side: "right", description: "Workflow automation platforms connecting AI with thousands of apps and services" },
  { id: "ai-apps", label: "AI-Powered Apps", color: "#14b8a6", side: "right", description: "Consumer and business apps supercharged with AI for productivity, communication, and creativity" },
];

// Helper function to generate positions (not used in final layout but kept for reference)
function generatePositions(categoryIndex: number, cardIndex: number, totalCards: number, side: "left" | "right"): { x: number; y: number } {
  const centerX = 2500;
  const centerY = 2000;
  const categoryRadius = 600;
  const cardRadius = 350;

  const leftCategories = categories.filter(c => c.side === "left");
  const rightCategories = categories.filter(c => c.side === "right");

  let angle: number;
  if (side === "left") {
    const idx = leftCategories.findIndex((_, i) => {
      let count = 0;
      for (let j = 0; j <= i; j++) count++;
      return count > categoryIndex - categories.filter(c => c.side === "left").indexOf(leftCategories[0]);
    });
    const step = 120 / (leftCategories.length + 1);
    angle = (150 + step * (categoryIndex + 1)) * (Math.PI / 180);
  } else {
    const rightIdx = categories.filter(c => c.side === "right").findIndex(c => c.id === categories.find((_, i) => i === categoryIndex)?.id);
    const step = 120 / (rightCategories.length + 1);
    angle = (-60 + step * (rightIdx + 1)) * (Math.PI / 180);
  }

  const catX = centerX + Math.cos(angle) * categoryRadius;
  const catY = centerY + Math.sin(angle) * categoryRadius;

  const cardAngle = ((cardIndex / Math.max(totalCards, 1)) * 2 * Math.PI) - Math.PI / 2;
  const x = catX + Math.cos(cardAngle) * cardRadius * (0.5 + (cardIndex % 3) * 0.3);
  const y = catY + Math.sin(cardAngle) * cardRadius * (0.5 + (cardIndex % 2) * 0.3);

  return { x, y };
}

export const defaultCards: CardData[] = [
  // === LLM CHATBOTS ===
  {
    id: "chatgpt-openai",
    title: "ChatGPT (OpenAI)",
    icon: "💬",
    category: "llm-chatbots",
    subcategory: "LLM Platform",
    color: "#6366f1",
    summary: "400M+ weekly users. ~64.5% market share. The dominant AI assistant with a vast ecosystem of sub-products.",
    tags: ["OpenAI", "GPT-5", "Market Leader", "400M Users"],
    links: ["https://platform.openai.com/docs", "https://openai.com/blog", "https://platform.openai.com/docs/changelog"],
    subProducts: [
      { name: "Sora 2", icon: "🎬", description: "Video generation — cinematic quality, realistic physics, synchronized dialogue & sound", releaseDate: "2025" },
      { name: "GPT Image 1.5", icon: "🎨", description: "Replaced DALL-E. #1 on LM Arena image leaderboard", releaseDate: "2025" },
      { name: "GPT-5.3-Codex", icon: "💻", description: "Agentic coding model. Strongest code generation", releaseDate: "2025" },
      { name: "Canvas", icon: "🖊️", description: "Collaborative editing workspace within ChatGPT", releaseDate: "2024" },
      { name: "Prism", icon: "🔬", description: "Research workspace for deep analysis", releaseDate: "2025" },
      { name: "Operator", icon: "🤖", description: "AI agent that browses and acts on the web. 256K context", releaseDate: "2025" },
      { name: "Custom GPTs", icon: "🛍️", description: "Marketplace of user-created specialized bots", releaseDate: "2023" },
      { name: "ChatGPT Search", icon: "🔍", description: "Web search replacing Google for many users", releaseDate: "2024" },
      { name: "Projects", icon: "📁", description: "Living sources — unified context from Slack, Drive, notes", releaseDate: "2026" },
    ],
    timeline: [
      { date: "2022-11", description: "GPT-3.5 / ChatGPT launch", type: "launch" },
      { date: "2023-03", description: "GPT-4 released", type: "launch" },
      { date: "2023-11", description: "Custom GPTs marketplace", type: "launch" },
      { date: "2024-05", description: "GPT-4o multimodal", type: "launch" },
      { date: "2024-09", description: "o1 reasoning model", type: "launch" },
      { date: "2024-10", description: "Canvas collaborative editing", type: "launch" },
      { date: "2024-12", description: "ChatGPT Search", type: "launch" },
      { date: "2025-01", description: "Operator AI agent", type: "launch" },
      { date: "2025-03", description: "GPT-5 released", type: "launch" },
      { date: "2025-06", description: "Sora 2 video generation", type: "launch" },
      { date: "2025-08", description: "GPT Image 1.5", type: "launch" },
      { date: "2025-10", description: "GPT-5.3-Codex", type: "launch" },
      { date: "2026-01", description: "Prism research workspace", type: "launch" },
      { date: "2026-02", description: "Projects with living sources", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "claude-anthropic",
    title: "Claude (Anthropic)",
    icon: "🧠",
    category: "llm-chatbots",
    subcategory: "LLM Platform",
    color: "#6366f1",
    summary: "AI safety company building reliable, interpretable, and steerable AI systems. Claude Opus 4.6 is the most capable model. Claude Code hit $1B revenue. Series G at $380B valuation.",
    tags: ["Anthropic", "Reasoning", "Coding", "MCP", "Agentic", "Safety"],
    links: ["https://docs.anthropic.com", "https://www.anthropic.com/news", "https://code.claude.com/docs/en/overview"],
    subProducts: [
      { name: "Claude 1.0", icon: "🤖", description: "First publicly available AI assistant", releaseDate: "2023-03" },
      { name: "Claude 2", icon: "🤖", description: "100K token context window, improved coding and reasoning", releaseDate: "2023-07" },
      { name: "Claude 2.1", icon: "🤖", description: "200K context, reduced hallucinations, system prompts & tool use beta", releaseDate: "2023-11" },
      { name: "Claude 3 Opus", icon: "🧠", description: "Most intelligent model — reasoning, math, coding. Vision capabilities", releaseDate: "2024-03" },
      { name: "Claude 3 Sonnet", icon: "⚡", description: "Balanced performance and speed with vision", releaseDate: "2024-03" },
      { name: "Claude 3 Haiku", icon: "🐇", description: "Fastest and most affordable with vision", releaseDate: "2024-03" },
      { name: "Claude 3.5 Sonnet", icon: "⚡", description: "Outperforms Opus on most benchmarks at Sonnet speed", releaseDate: "2024-06" },
      { name: "Claude 3.5 Haiku", icon: "🐇", description: "Matches prior Opus performance", releaseDate: "2024-10" },
      { name: "Claude 4 (Opus & Sonnet)", icon: "🧠", description: "Hybrid models — instant + extended thinking. New benchmarks", releaseDate: "2025-05" },
      { name: "Claude Sonnet 4.5", icon: "⚡", description: "Frontier coding, agents, and professional performance", releaseDate: "2025-09" },
      { name: "Claude Opus 4.5", icon: "🏆", description: "Best model for coding, agents, and computer use", releaseDate: "2025-11" },
      { name: "Claude Opus 4.6", icon: "🏆", description: "Most capable model — enhanced reasoning, coding, agentic", releaseDate: "2026-02" },
      { name: "Claude Sonnet 4.6", icon: "⚡", description: "Frontier performance across coding, agents, professional work", releaseDate: "2026-02" },
      { name: "Artifacts", icon: "📎", description: "Live code/document previews in conversation (industry first)", releaseDate: "2024-06" },
      { name: "Computer Use", icon: "🖥️", description: "First AI to control desktop natively — looking at screens, clicking, typing", releaseDate: "2024-10" },
      { name: "MCP", icon: "🔌", description: "'USB-C for AI' — open protocol connecting any AI to any tool", releaseDate: "2024-11" },
      { name: "Extended Thinking", icon: "🧠", description: "Visible chain-of-thought reasoning for complex problems", releaseDate: "2025-02" },
      { name: "Claude Code", icon: "💻", description: "CLI agentic coding tool — subagents, parallel execution, worktrees", releaseDate: "2025-05" },
      { name: "Claude Code Desktop", icon: "🖥️", description: "Standalone app — visual diffs, parallel sessions, PR monitoring", releaseDate: "2025-07" },
      { name: "Claude Code VS Code", icon: "📝", description: "Inline diffs, @-mentions, plan review in editor", releaseDate: "2025-07" },
      { name: "Claude Code JetBrains", icon: "🔧", description: "IntelliJ, PyCharm, WebStorm integration", releaseDate: "2025-07" },
      { name: "Hooks", icon: "🪝", description: "Run shell commands before/after Claude actions", releaseDate: "2025-08" },
      { name: "Subagents", icon: "🤖", description: "Spawn multiple agents working simultaneously", releaseDate: "2025-08" },
      { name: "GitHub Actions", icon: "🔄", description: "Automate PR reviews and issue triage in CI/CD", releaseDate: "2025-08" },
      { name: "Chrome Integration", icon: "🌐", description: "Debug live web apps directly from Claude Code", releaseDate: "2025-09" },
      { name: "Slack Integration", icon: "💬", description: "Route bug reports from Slack, mention @Claude", releaseDate: "2025-09" },
      { name: "Plugins & Marketplace", icon: "🧩", description: "Discover, install, create prebuilt plugins", releaseDate: "2025-09" },
      { name: "Checkpointing", icon: "💾", description: "Track, rewind, and summarize edits", releaseDate: "2025-09" },
      { name: "Skills", icon: "⚡", description: "Teachable custom behaviors & scheduled tasks", releaseDate: "2025-10" },
      { name: "Sandboxing", icon: "🔒", description: "Filesystem and network isolation for secure execution", releaseDate: "2025-10" },
      { name: "Dev Containers", icon: "📦", description: "Consistent, secure team environments", releaseDate: "2025-10" },
      { name: "Claude Code Security", icon: "🛡️", description: "Scans codebases for vulnerabilities, suggests patches", releaseDate: "2026-02" },
      { name: "Remote Control", icon: "📱", description: "Continue local sessions from phone, tablet, or browser", releaseDate: "2026-02" },
      { name: "Fast Mode", icon: "⚡", description: "Speed up responses with Opus 4.6 optimization", releaseDate: "2026-02" },
      { name: "Healthcare", icon: "🏥", description: "HIPAA-ready infrastructure and life sciences connectors", releaseDate: "2026-01" },
      { name: "Anthropic Labs", icon: "🧪", description: "Experimental platform for cutting-edge capabilities", releaseDate: "2026-01" },
      { name: "Cowork", icon: "🤝", description: "Desktop automation for non-developers", releaseDate: "2026-01" },
    ],
    timeline: [
      { date: "2023-03-14", description: "Claude 1.0 launched — first publicly available AI assistant", type: "model" },
      { date: "2023-07-11", description: "Claude 2 released — 100K context, improved coding & reasoning", type: "model" },
      { date: "2023-11-21", description: "Claude 2.1 — 200K context, reduced hallucinations, tool use beta", type: "model" },
      { date: "2024-03-04", description: "Claude 3 family launched — Opus, Sonnet, Haiku with vision", type: "model" },
      { date: "2024-03-04", description: "Claude for Enterprise — admin controls, SSO, data retention", type: "business" },
      { date: "2024-03-14", description: "Claude 3 Haiku — fastest and most affordable with vision", type: "model" },
      { date: "2024-05-01", description: "Tool use generally available on the API", type: "api" },
      { date: "2024-05-30", description: "Claude Team plan & iOS app launched", type: "business" },
      { date: "2024-06-20", description: "Artifacts — live code/document previews (industry first)", type: "product" },
      { date: "2024-06-20", description: "Claude 3.5 Sonnet — outperforms Opus at Sonnet speed", type: "model" },
      { date: "2024-06-25", description: "Projects — organize chats with curated knowledge", type: "product" },
      { date: "2024-07-09", description: "Claude Android app launched", type: "product" },
      { date: "2024-08-14", description: "Prompt caching — up to 90% API cost reduction", type: "api" },
      { date: "2024-09-02", description: "Artifacts generally available across all plans", type: "product" },
      { date: "2024-09-19", description: "Contextual retrieval — more accurate RAG technique", type: "api" },
      { date: "2024-10-22", description: "Upgraded 3.5 Sonnet + Claude 3.5 Haiku — Computer Use beta", type: "model" },
      { date: "2024-10-22", description: "Computer Use beta — first AI to control desktop natively", type: "product" },
      { date: "2024-10-31", description: "Token-saving updates — cache-aware rate limits", type: "api" },
      { date: "2024-11-14", description: "AI-powered Artifacts — turn artifacts into interactive apps", type: "product" },
      { date: "2024-11-25", description: "Model Context Protocol (MCP) — 'USB-C for AI' open standard", type: "api" },
      { date: "2024-11-25", description: "Productivity platform integrations", type: "product" },
      { date: "2025-01-27", description: "Max Plan — up to 20x higher usage limits", type: "business" },
      { date: "2025-02-24", description: "Extended thinking preview — visible chain-of-thought", type: "model" },
      { date: "2025-04-14", description: "Agent capabilities on the API — code execution, MCP connector, Files API", type: "api" },
      { date: "2025-05-22", description: "Claude 4 (Opus & Sonnet) — hybrid instant + extended thinking", type: "model" },
      { date: "2025-05-22", description: "Claude Code GA — CLI agentic coding with subagents & worktrees", type: "product" },
      { date: "2025-06-18", description: "Claude Code on Team & Enterprise — admin controls, spend caps", type: "product" },
      { date: "2025-07-01", description: "Claude Code on the web — no local install, long-running tasks", type: "product" },
      { date: "2025-07-01", description: "Claude Code Desktop app — visual diffs, parallel sessions", type: "product" },
      { date: "2025-07-01", description: "Claude Code VS Code & JetBrains plugins", type: "product" },
      { date: "2025-08-01", description: "Hooks — run shell commands before/after Claude actions", type: "product" },
      { date: "2025-08-01", description: "Subagents — parallel agent execution", type: "product" },
      { date: "2025-08-01", description: "GitHub Actions & GitLab CI/CD integration", type: "product" },
      { date: "2025-09-01", description: "Chrome & Slack integrations for Claude Code", type: "product" },
      { date: "2025-09-01", description: "Plugins & Marketplace, Checkpointing", type: "product" },
      { date: "2025-09-01", description: "Claude Agent SDK — build custom agents", type: "api" },
      { date: "2025-09-25", description: "Claude Sonnet 4.5 — frontier coding & agent performance", type: "model" },
      { date: "2025-10-01", description: "Sandboxing & Dev Containers for secure execution", type: "product" },
      { date: "2025-10-16", description: "Agent Skills — teachable custom behaviors & scheduled tasks", type: "product" },
      { date: "2025-11-01", description: "Claude in Microsoft Foundry & 365 Copilot", type: "partnership" },
      { date: "2025-11-24", description: "Claude Opus 4.5 — best model for coding, agents, computer use", type: "model" },
      { date: "2025-12-02", description: "Claude for Nonprofits — free AI training & discounted rates", type: "business" },
      { date: "2025-12-03", description: "Anthropic acquires Bun — Claude Code hits $1B revenue", type: "business" },
      { date: "2025-12-03", description: "Snowflake partnership ($200M)", type: "partnership" },
      { date: "2025-12-09", description: "Accenture multi-year enterprise partnership", type: "partnership" },
      { date: "2025-12-09", description: "MCP donated to Agentic AI Foundation", type: "api" },
      { date: "2025-12-18", description: "Protecting user wellbeing — safety initiatives", type: "safety" },
      { date: "2025-12-18", description: "US Dept of Energy Genesis Mission partnership", type: "partnership" },
      { date: "2025-12-19", description: "SB53 compliance framework for California AI Act", type: "safety" },
      { date: "2026-01-11", description: "Claude for Healthcare — HIPAA-ready infrastructure", type: "product" },
      { date: "2026-01-13", description: "Anthropic Labs — experimental capabilities platform", type: "product" },
      { date: "2026-01-15", description: "Anthropic Economic Index — AI adoption metrics", type: "research" },
      { date: "2026-01-21", description: "Teach For All global AI training initiative", type: "partnership" },
      { date: "2026-01-22", description: "Claude's new constitution — updated values framework", type: "safety" },
      { date: "2026-01-27", description: "UK Government GOV.UK partnership", type: "partnership" },
      { date: "2026-01-28", description: "ServiceNow integration — customer & internal AI", type: "partnership" },
      { date: "2026-01-30", description: "Claude on Mars — Perseverance rover 400m autonomous nav", type: "milestone" },
      { date: "2026-02-01", description: "Remote Control — continue sessions from any device", type: "product" },
      { date: "2026-02-01", description: "Fast Mode & Server-managed settings", type: "product" },
      { date: "2026-02-02", description: "Allen Institute & HHMI scientific partnership", type: "partnership" },
      { date: "2026-02-03", description: "Apple Xcode + Claude Agent SDK integration", type: "partnership" },
      { date: "2026-02-04", description: "Claude is a space to think — ad-free commitment", type: "safety" },
      { date: "2026-02-05", description: "Claude Opus 4.6 — most capable model released", type: "model" },
      { date: "2026-02-11", description: "Covering data center electricity costs", type: "business" },
      { date: "2026-02-12", description: "Series G — $30B at $380B valuation ($14B run-rate)", type: "funding" },
      { date: "2026-02-12", description: "$20M donation to Public First Action", type: "safety" },
      { date: "2026-02-13", description: "CodePath partnership — largest US CS program", type: "partnership" },
      { date: "2026-02-16", description: "Bengaluru office opened — India expansion", type: "business" },
      { date: "2026-02-17", description: "Claude Sonnet 4.6 — frontier coding & agent performance", type: "model" },
      { date: "2026-02-17", description: "Rwanda MOU — AI in health & education", type: "partnership" },
      { date: "2026-02-17", description: "Infosys — AI agents for telecom", type: "partnership" },
      { date: "2026-02-20", description: "Claude Code Security — vulnerability scanning & patches", type: "product" },
      { date: "2026-02-23", description: "Detecting & preventing distillation attacks", type: "safety" },
      { date: "2026-02-24", description: "Responsible Scaling Policy v3.0", type: "safety" },
      { date: "2026-02-25", description: "Vercept acquisition — enhanced computer use", type: "business" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "gemini-google",
    title: "Gemini (Google)",
    icon: "🔍",
    category: "llm-chatbots",
    subcategory: "LLM Platform",
    color: "#6366f1",
    summary: "~21.5% market share. Deep Google Workspace integration. Veo 3.1 video gen and Jules coding agent.",
    tags: ["Google", "Workspace", "Veo", "Jules"],
    links: ["https://ai.google.dev/docs", "https://blog.google/technology/ai/", "https://developers.googleblog.com/"],
    subProducts: [
      { name: "Veo 3.1", icon: "🎬", description: "Video generation — native 4K, 1+ min coherent videos", releaseDate: "2025" },
      { name: "Gemini CLI", icon: "💻", description: "Terminal coding tool", releaseDate: "2025" },
      { name: "Gemini Live", icon: "🎙️", description: "Real-time voice conversations", releaseDate: "2024" },
      { name: "NotebookLM", icon: "📓", description: "AI-powered notebook for research", releaseDate: "2024" },
      { name: "Jules", icon: "🤖", description: "Autonomous coding agent — 73% task completion", releaseDate: "2026" },
      { name: "Gemini 3 Flash", icon: "⚡", description: "Pro reasoning + Flash speed for agentic workflows", releaseDate: "2026" },
    ],
    timeline: [
      { date: "2023-12", description: "Gemini 1.0 launched", type: "launch" },
      { date: "2024-02", description: "1.5 Pro — first 1M context", type: "launch" },
      { date: "2024-06", description: "Workspace integration", type: "launch" },
      { date: "2024-09", description: "Gemini Live voice", type: "launch" },
      { date: "2025-02", description: "2.0 Flash", type: "launch" },
      { date: "2025-06", description: "CLI tool", type: "launch" },
      { date: "2025-09", description: "Veo 3.1 video", type: "launch" },
      { date: "2026-01", description: "3.1 Pro, Jules, 3 Flash", type: "launch" },
      { date: "2026", description: "Replacing Google Assistant", type: "update" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "deepseek",
    title: "DeepSeek",
    icon: "🐉",
    category: "llm-chatbots",
    subcategory: "Open Source LLM",
    color: "#6366f1",
    summary: "Chinese, MIT open-source. ~3.7% share. Massive disruptor. V3.2 unified model at fraction of cost.",
    tags: ["Chinese", "Open Source", "MIT", "Cheap", "Disruptor"],
    links: ["https://api-docs.deepseek.com/", "https://github.com/deepseek-ai"],
    subProducts: [
      { name: "DeepSeek V3.2", icon: "🧠", description: "Unified model — both chat AND reasoning at same price" },
      { name: "R1", icon: "💭", description: "Reasoning model, multiple sizes (1.5B to 70B)" },
    ],
    timeline: [
      { date: "2023", description: "Founded", type: "launch" },
      { date: "2024", description: "V2 released", type: "launch" },
      { date: "2025-01", description: "R1 matched o1 at fraction of cost (caused Nvidia stock crash)", type: "launch" },
      { date: "2025", description: "V3.1", type: "update" },
      { date: "2026", description: "V3.2 unified model", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "grok-xai",
    title: "Grok (xAI)",
    icon: "⚡",
    category: "llm-chatbots",
    subcategory: "LLM Platform",
    color: "#6366f1",
    summary: "Elon Musk. ~3.4% share. X/Twitter real-time data. Multi-agent system with 4 specialized agents.",
    tags: ["xAI", "Musk", "X/Twitter", "Multi-agent"],
    links: ["https://docs.x.ai/docs"],
    subProducts: [],
    timeline: [
      { date: "2023-11", description: "Grok-1 launched", type: "launch" },
      { date: "2024-03", description: "Grok-1 open-sourced", type: "milestone" },
      { date: "2026-03", description: "Grok 4.20 Beta 2 — multi-agent system", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "meta-llama",
    title: "Meta AI / Llama",
    icon: "🦙",
    category: "llm-chatbots",
    subcategory: "Open Source LLM",
    color: "#6366f1",
    summary: "Open source leader. Llama 4 Scout/Maverick. First open source to rival closed-source models.",
    tags: ["Meta", "Open Source", "Llama 4"],
    links: ["https://llama.meta.com/docs/overview", "https://ai.meta.com/blog/"],
    subProducts: [
      { name: "Llama 4 Scout", icon: "🔍", description: "17B params, 16 experts" },
      { name: "Llama 4 Maverick", icon: "🚀", description: "17B latest model" },
      { name: "Llama 3.1 405B", icon: "💪", description: "First open source to rival closed-source" },
    ],
    timeline: [
      { date: "2023-02", description: "Llama 1 released", type: "launch" },
      { date: "2023-07", description: "Llama 2 open source", type: "launch" },
      { date: "2024-04", description: "Llama 3 models", type: "launch" },
      { date: "2024-07", description: "Llama 3.1 405B", type: "launch" },
      { date: "2024-09", description: "Llama 3.2 multimodal", type: "launch" },
      { date: "2025", description: "Llama 4 Scout & Maverick", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "mistral",
    title: "Mistral AI",
    icon: "🌬️",
    category: "llm-chatbots",
    subcategory: "European LLM",
    color: "#6366f1",
    summary: "European AI champion. Mistral Large 2, open-weight models. Le Chat assistant. Strong multilingual & coding performance.",
    tags: ["European", "Open Weight", "Le Chat", "Multilingual"],
    links: ["https://docs.mistral.ai/", "https://mistral.ai/news/"],
    subProducts: [
      { name: "Mistral Large 2", icon: "🧠", description: "Flagship 123B model, strong coding & reasoning" },
      { name: "Le Chat", icon: "💬", description: "Consumer AI assistant with web search & canvas" },
      { name: "Codestral", icon: "💻", description: "Dedicated coding model, 32K context" },
    ],
    timeline: [
      { date: "2023-09", description: "Mistral 7B — strongest open 7B model", type: "launch" },
      { date: "2024-02", description: "Mistral Large launched", type: "launch" },
      { date: "2024-07", description: "Mistral Large 2 (123B params)", type: "launch" },
      { date: "2025", description: "Le Chat consumer app, Codestral", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "cohere",
    title: "Cohere",
    icon: "🔗",
    category: "llm-chatbots",
    subcategory: "Enterprise LLM",
    color: "#6366f1",
    summary: "Enterprise-focused. Command R+ for RAG. Best-in-class retrieval augmented generation. Private cloud deployment.",
    tags: ["Enterprise", "RAG", "Command R+", "Private Cloud"],
    links: ["https://docs.cohere.com/", "https://cohere.com/blog"],
    subProducts: [
      { name: "Command R+", icon: "🧠", description: "Enterprise RAG-optimized model, 128K context" },
      { name: "Embed v3", icon: "📐", description: "Best-in-class multilingual embeddings" },
      { name: "Rerank 3", icon: "🔍", description: "Search result reranking model" },
    ],
    timeline: [
      { date: "2022", description: "Founded, early API access", type: "launch" },
      { date: "2024-04", description: "Command R+ launched", type: "launch" },
      { date: "2025", description: "Enterprise RAG suite, private cloud", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "microsoft-copilot",
    title: "Microsoft Copilot",
    icon: "🪟",
    category: "llm-chatbots",
    subcategory: "Enterprise AI",
    color: "#6366f1",
    summary: "AI embedded across Microsoft 365: Word, Excel, PowerPoint, Teams, Outlook. Enterprise-grade with data security.",
    tags: ["Microsoft", "Office 365", "Enterprise", "Teams"],
    links: ["https://learn.microsoft.com/en-us/copilot/", "https://blogs.microsoft.com/blog/category/microsoft-copilot/"],
    subProducts: [
      { name: "Copilot in Word", icon: "📝", description: "Draft, rewrite, summarize documents" },
      { name: "Copilot in Excel", icon: "📊", description: "Analyze data, create formulas, generate insights" },
      { name: "Copilot in Teams", icon: "👥", description: "Meeting summaries, action items, chat recaps" },
    ],
    timeline: [
      { date: "2023-03", description: "Microsoft 365 Copilot announced", type: "launch" },
      { date: "2023-11", description: "Enterprise GA at $30/user/mo", type: "launch" },
      { date: "2025", description: "Copilot Vision, Copilot Actions", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },

  // === CODING TOOLS ===
  {
    id: "cursor",
    title: "Cursor",
    icon: "⌨️",
    category: "coding-tools",
    subcategory: "AI IDE",
    color: "#06b6d4",
    summary: "AI-first code editor (VS Code fork). Most popular AI IDE. $20/mo. Spawns subagents creating trees of coordinated work.",
    tags: ["IDE", "VS Code", "AI Coding", "Popular"],
    links: ["https://docs.cursor.com/", "https://cursor.com/changelog"],
    subProducts: [
      { name: "Composer 1.5", icon: "🎼", description: "Multi-file agent mode with subagents" },
      { name: "Long-running Agents", icon: "🤖", description: "Background autonomous coding tasks" },
    ],
    timeline: [
      { date: "2023", description: "Cursor IDE launched", type: "launch" },
      { date: "2026-02", description: "Cursor 2.5 with long-running agents, Composer 1.5", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "windsurf",
    title: "Windsurf",
    icon: "🌊",
    category: "coding-tools",
    subcategory: "AI IDE",
    color: "#06b6d4",
    summary: "By Cognition AI (acquired ~$250M). #1 LogRocket AI Dev Tool Rankings. Arena Mode, Plan Mode.",
    tags: ["IDE", "Cognition", "Devin", "1M Lines"],
    links: ["https://docs.windsurf.com/", "https://windsurf.com/changelog"],
    subProducts: [
      { name: "Arena Mode", icon: "⚔️", description: "Side-by-side model comparison" },
      { name: "Plan Mode", icon: "📋", description: "Task planning before execution" },
    ],
    timeline: [
      { date: "2025-12", description: "Cognition AI acquisition ~$250M", type: "funding" },
      { date: "2026", description: "Plans to merge with Devin", type: "update" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "github-copilot",
    title: "GitHub Copilot",
    icon: "🐙",
    category: "coding-tools",
    subcategory: "AI Assistant",
    color: "#06b6d4",
    summary: "Microsoft/GitHub. Enterprise standard. Agent Mode in VS Code, JetBrains, Eclipse, Xcode.",
    tags: ["Microsoft", "GitHub", "Enterprise", "Multi-IDE"],
    links: ["https://docs.github.com/en/copilot", "https://github.blog/changelog/"],
    subProducts: [
      { name: "Agent Mode", icon: "🤖", description: "Determines files to change, iterates to fix" },
      { name: "Copilot Workspace", icon: "🏗️", description: "Issue-to-PR workflow, async execution" },
      { name: "Coding Agent", icon: "⚡", description: "GA since Sep 2025, sub-agent architecture" },
    ],
    timeline: [
      { date: "2021-06", description: "GitHub Copilot preview", type: "launch" },
      { date: "2025-09", description: "Coding Agent GA", type: "launch" },
      { date: "2026", description: "Agent Mode across all IDEs + MCP integration", type: "update" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "lovable",
    title: "Lovable",
    icon: "❤️",
    category: "coding-tools",
    subcategory: "App Builder",
    color: "#06b6d4",
    summary: "$100M ARR in 8 months (fastest SaaS ever?). Full-stack React/TypeScript apps from prompts. Native Supabase integration.",
    tags: ["App Builder", "React", "Full-stack", "$100M ARR"],
    links: ["https://docs.lovable.dev/"],
    subProducts: [],
    timeline: [
      { date: "2024", description: "Founded, rapid growth", type: "launch" },
      { date: "2025", description: "$100M ARR in 8 months", type: "milestone" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "bolt-new",
    title: "Bolt.new",
    icon: "⚡",
    category: "coding-tools",
    subcategory: "App Builder",
    color: "#06b6d4",
    summary: "By StackBlitz. Full-stack web apps in browser. Fastest prototype gen (28 min avg). Multi-framework.",
    tags: ["StackBlitz", "Browser", "Multi-framework"],
    links: ["https://docs.bolt.new/"],
    subProducts: [],
    timeline: [],
    positionX: 0, positionY: 0,
  },
  {
    id: "v0-vercel",
    title: "v0 (Vercel)",
    icon: "▲",
    category: "coding-tools",
    subcategory: "Component Gen",
    color: "#06b6d4",
    summary: "React component generator using shadcn/ui. Highest code quality 9/10. Git integration, VS Code-style editor.",
    tags: ["Vercel", "React", "shadcn", "Components"],
    links: ["https://v0.dev/docs"],
    subProducts: [],
    timeline: [
      { date: "2023-10", description: "v0 launched", type: "launch" },
      { date: "2026-02", description: "Major overhaul: Git integration, VS Code editor", type: "update" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "replit",
    title: "Replit",
    icon: "☁️",
    category: "coding-tools",
    subcategory: "Cloud IDE",
    color: "#06b6d4",
    summary: "Cloud IDE. Agent 3 with enhanced capabilities. Core $20/mo. Pro: turbo mode 2x faster.",
    tags: ["Cloud IDE", "Agent", "Collaborative"],
    links: ["https://docs.replit.com/", "https://blog.replit.com/"],
    subProducts: [],
    timeline: [
      { date: "2026-03", description: "Plan changes: Teams → Pro, Core $20/mo", type: "update" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "claude-code",
    title: "Claude Code",
    icon: "💻",
    category: "coding-tools",
    subcategory: "CLI Agent",
    color: "#06b6d4",
    summary: "Anthropic's CLI agentic coding tool. Subagents, parallel execution, worktrees. 77.2% SWE-bench. Open source.",
    tags: ["Anthropic", "CLI", "Agentic", "SWE-bench"],
    links: ["https://docs.anthropic.com/en/docs/claude-code"],
    subProducts: [],
    timeline: [
      { date: "2025-02", description: "Claude Code preview", type: "launch" },
      { date: "2025-05", description: "General availability", type: "launch" },
      { date: "2025-12", description: "Open-sourced on GitHub", type: "milestone" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "tabnine",
    title: "Tabnine",
    icon: "📝",
    category: "coding-tools",
    subcategory: "Code Completion",
    color: "#06b6d4",
    summary: "Enterprise AI code assistant. Runs on private infrastructure. Trained only on permissively licensed code. SOC 2 certified.",
    tags: ["Enterprise", "Private", "Compliance", "On-prem"],
    links: ["https://docs.tabnine.com/"],
    subProducts: [],
    timeline: [
      { date: "2018", description: "Founded (originally Codota)", type: "launch" },
      { date: "2025", description: "Enterprise focus, private deployment", type: "update" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "amazon-q",
    title: "Amazon Q Developer",
    icon: "🅰️",
    category: "coding-tools",
    subcategory: "AI Assistant",
    color: "#06b6d4",
    summary: "AWS's AI coding assistant. Code generation, debugging, optimization. Deep AWS service integration. Free tier available.",
    tags: ["AWS", "Enterprise", "Cloud", "Free Tier"],
    links: ["https://docs.aws.amazon.com/amazonq/"],
    subProducts: [],
    timeline: [
      { date: "2023-11", description: "Launched as Amazon CodeWhisperer", type: "launch" },
      { date: "2024-04", description: "Rebranded to Amazon Q Developer", type: "update" },
      { date: "2025", description: "Agent capabilities, /transform command", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },

  // === IMAGE GENERATION ===
  {
    id: "midjourney",
    title: "Midjourney",
    icon: "🖼️",
    category: "image-gen",
    subcategory: "Aesthetic AI",
    color: "#d946ef",
    summary: "Best aesthetic quality. V7 alpha expected Apr 2026. Voice prompting, faster draft mode. Video gen added.",
    tags: ["Art", "Aesthetic", "Discord", "V7"],
    links: ["https://docs.midjourney.com/"],
    subProducts: [],
    timeline: [
      { date: "2022-07", description: "V1 launched via Discord", type: "launch" },
      { date: "2024", description: "V6 with major quality improvements", type: "launch" },
      { date: "2025", description: "Video generation added", type: "launch" },
      { date: "2026-04", description: "V7 alpha expected", type: "update" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "flux",
    title: "Flux",
    icon: "🌈",
    category: "image-gen",
    subcategory: "Open Source",
    color: "#d946ef",
    summary: "FLUX.2 by Black Forest Labs. Klein: fastest image models. Up to 4MP photorealistic output with reliable text rendering.",
    tags: ["Black Forest Labs", "Fast", "Photorealistic", "Text Rendering"],
    links: ["https://blackforestlabs.ai/", "https://github.com/black-forest-labs/flux"],
    subProducts: [
      { name: "FLUX Pro", icon: "⭐", description: "Highest quality" },
      { name: "FLUX Klein", icon: "⚡", description: "Fastest image models (Jan 2026)" },
    ],
    timeline: [
      { date: "2024-08", description: "FLUX.1 launched", type: "launch" },
      { date: "2025-11", description: "FLUX.2", type: "launch" },
      { date: "2026-01", description: "Klein — fastest models", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "stable-diffusion",
    title: "Stable Diffusion",
    icon: "🎭",
    category: "image-gen",
    subcategory: "Open Source",
    color: "#d946ef",
    summary: "Open-source. SD 3.5 Large: 8B params, superior quality. Runs on consumer hardware. Free for non-commercial.",
    tags: ["Open Source", "Consumer GPU", "Free"],
    links: ["https://stability.ai/news", "https://github.com/Stability-AI/stablediffusion"],
    subProducts: [],
    timeline: [
      { date: "2022-08", description: "SD 1.0 launched", type: "launch" },
      { date: "2025", description: "SD 3.5 family (Large, Turbo, Medium)", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "ideogram",
    title: "Ideogram",
    icon: "✏️",
    category: "image-gen",
    subcategory: "Typography AI",
    color: "#d946ef",
    summary: "Best text rendering: 90-95% accuracy (vs Midjourney 30-40%). V3. Typography-first visual engine.",
    tags: ["Text Rendering", "Typography", "90% Accuracy"],
    links: ["https://ideogram.ai/about"],
    subProducts: [],
    timeline: [
      { date: "2023", description: "Founded, V1", type: "launch" },
      { date: "2025", description: "V3 with batch generation", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "dalle",
    title: "DALL·E 3",
    icon: "🎨",
    category: "image-gen",
    subcategory: "OpenAI Image",
    color: "#d946ef",
    summary: "OpenAI's image gen. Tight ChatGPT integration. Superseded by GPT Image 1.5 but still widely used via API.",
    tags: ["OpenAI", "ChatGPT", "API", "Inpainting"],
    links: ["https://platform.openai.com/docs/guides/images"],
    subProducts: [],
    timeline: [
      { date: "2021-01", description: "DALL·E 1 announced", type: "launch" },
      { date: "2022-04", description: "DALL·E 2 with inpainting", type: "launch" },
      { date: "2023-10", description: "DALL·E 3 in ChatGPT", type: "launch" },
      { date: "2025", description: "Superseded by GPT Image 1.5", type: "update" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "leonardo-ai",
    title: "Leonardo AI",
    icon: "🎮",
    category: "image-gen",
    subcategory: "Creative AI",
    color: "#d946ef",
    summary: "Game asset & creative image generation. Phoenix model. Real-time canvas, style consistency. Free tier available.",
    tags: ["Game Assets", "Phoenix", "Canvas", "Free Tier"],
    links: ["https://docs.leonardo.ai/"],
    subProducts: [],
    timeline: [
      { date: "2023", description: "Leonardo AI launched", type: "launch" },
      { date: "2024", description: "Phoenix model, Motion feature", type: "launch" },
      { date: "2025", description: "Real-time canvas, style transfer", type: "update" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "adobe-firefly",
    title: "Adobe Firefly",
    icon: "🔥",
    category: "image-gen",
    subcategory: "Enterprise Creative",
    color: "#d946ef",
    summary: "Adobe's commercially safe AI. Trained on licensed content. Integrated into Photoshop, Illustrator, Express. IP indemnity.",
    tags: ["Adobe", "Commercial Safe", "Photoshop", "IP Protected"],
    links: ["https://helpx.adobe.com/firefly/using/whats-new.html", "https://developer.adobe.com/firefly-services/docs/"],
    subProducts: [
      { name: "Generative Fill", icon: "🖌️", description: "AI fill/extend in Photoshop" },
      { name: "Text Effects", icon: "✨", description: "Stylized text generation" },
    ],
    timeline: [
      { date: "2023-03", description: "Firefly beta launched", type: "launch" },
      { date: "2023-09", description: "GA in Creative Cloud", type: "launch" },
      { date: "2025", description: "Firefly Image 3, video features", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },

  // === VIDEO GENERATION ===
  {
    id: "seedance",
    title: "Seedance 2.0 (ByteDance)",
    icon: "🌱",
    category: "video-gen",
    subcategory: "Cinema AI",
    color: "#10b981",
    summary: "#1 on Artificial Analysis benchmark. Cinema-grade with native audio. Director-level camera control with realistic physics.",
    tags: ["ByteDance", "#1 Benchmark", "Cinema", "Audio"],
    links: ["https://www.seedance.ai/"],
    subProducts: [],
    timeline: [
      { date: "2026-02", description: "#1 on Artificial Analysis benchmark", type: "milestone" },
      { date: "2026-03", description: "LumeFlow integration", type: "update" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "runway",
    title: "Runway Gen-4.5",
    icon: "🎞️",
    category: "video-gen",
    subcategory: "Professional Video",
    color: "#10b981",
    summary: "#1 on Artificial Analysis Text-to-Video. Native audio, long-form, multi-shot, character consistency.",
    tags: ["Professional", "#1 T2V", "Pioneer", "Multi-shot"],
    links: ["https://docs.runwayml.com/", "https://runwayml.com/blog"],
    subProducts: [],
    timeline: [
      { date: "2023", description: "Pioneer of AI video gen", type: "launch" },
      { date: "2025", description: "Gen-4.5 with native audio", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "kling",
    title: "Kling 2.6",
    icon: "🎵",
    category: "video-gen",
    subcategory: "Audio+Video",
    color: "#10b981",
    summary: "By Kuaishou. First AI to generate synchronized video AND audio together. Omni One architecture.",
    tags: ["Kuaishou", "Audio+Video", "Omni One"],
    links: ["https://klingai.com/"],
    subProducts: [],
    timeline: [
      { date: "2025-12", description: "First synchronized video+audio generation", type: "milestone" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "pika",
    title: "Pika 2.5",
    icon: "📱",
    category: "video-gen",
    subcategory: "Creative Video",
    color: "#10b981",
    summary: "Physics-aware effects. Understands weight, squish, liquid flow. Launching AI-only social video app.",
    tags: ["Physics", "Fun", "Social App", "Controllable"],
    links: ["https://pika.art/blog"],
    subProducts: [],
    timeline: [
      { date: "2023", description: "Pika 1.0 launched", type: "launch" },
      { date: "2025", description: "Pika 2.5 with physics-aware effects", type: "launch" },
      { date: "2026", description: "AI social video app (iOS early access)", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "veo",
    title: "Veo (Google)",
    icon: "🎬",
    category: "video-gen",
    subcategory: "Cinema AI",
    color: "#10b981",
    summary: "Google DeepMind video generation. Veo 3.1: native 4K, 1+ min coherent videos. Integrated into Gemini ecosystem.",
    tags: ["Google", "4K", "Cinema", "DeepMind"],
    links: ["https://deepmind.google/technologies/veo/"],
    subProducts: [
      { name: "Veo 3.1", icon: "🎬", description: "Native 4K, 1+ min coherent video generation", releaseDate: "2025" },
    ],
    timeline: [
      { date: "2024-05", description: "Veo announced at Google I/O", type: "launch" },
      { date: "2025", description: "Veo 3.1 with native 4K", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "sora",
    title: "Sora (OpenAI)",
    icon: "🎥",
    category: "video-gen",
    subcategory: "Cinema AI",
    color: "#10b981",
    summary: "OpenAI's video generation model. Cinematic quality with realistic physics. Text-to-video and image-to-video.",
    tags: ["OpenAI", "Cinema", "Physics", "Cinematic"],
    links: ["https://openai.com/sora", "https://platform.openai.com/docs"],
    subProducts: [],
    timeline: [
      { date: "2024-02", description: "Sora preview announced", type: "launch" },
      { date: "2024-12", description: "Sora public launch", type: "launch" },
      { date: "2025", description: "Sora 2 with synchronized audio", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "luma",
    title: "Luma Dream Machine",
    icon: "💫",
    category: "video-gen",
    subcategory: "3D Video",
    color: "#10b981",
    summary: "3D-aware video generation. Ray2 model. Understands spatial relationships, camera movement, depth. Free tier.",
    tags: ["3D-aware", "Ray2", "Spatial", "Free"],
    links: ["https://lumalabs.ai/dream-machine"],
    subProducts: [],
    timeline: [
      { date: "2024-06", description: "Dream Machine launched", type: "launch" },
      { date: "2025", description: "Ray2 model with 3D understanding", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "hailuoai",
    title: "HailuoAI (MiniMax)",
    icon: "🌊",
    category: "video-gen",
    subcategory: "Video Model",
    color: "#10b981",
    summary: "By MiniMax. Director model with precise camera control. High-quality video generation with character consistency.",
    tags: ["MiniMax", "Director", "Camera Control", "Free"],
    links: ["https://hailuoai.video/"],
    subProducts: [],
    timeline: [
      { date: "2024", description: "HailuoAI video launched", type: "launch" },
      { date: "2025", description: "Director model with camera control", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },

  // === AUDIO & MUSIC ===
  {
    id: "elevenlabs",
    title: "ElevenLabs",
    icon: "🎙️",
    category: "audio-music",
    subcategory: "Voice AI",
    color: "#ec4899",
    summary: "Industry-leading voice cloning & TTS. 29 languages. Used by publishers, game studios, content creators. API-first.",
    tags: ["Voice Cloning", "TTS", "29 Languages", "API"],
    links: ["https://elevenlabs.io/docs", "https://elevenlabs.io/blog"],
    subProducts: [
      { name: "Voice Cloning", icon: "🎤", description: "Clone any voice from minutes of audio" },
      { name: "Dubbing", icon: "🌐", description: "Automatic video dubbing in 29 languages" },
      { name: "Sound Effects", icon: "🔊", description: "AI-generated sound effects from text" },
    ],
    timeline: [
      { date: "2023", description: "ElevenLabs launched", type: "launch" },
      { date: "2024", description: "Voice cloning, dubbing, sound effects", type: "launch" },
      { date: "2025-01", description: "$180M Series C at $3B valuation", type: "funding" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "suno",
    title: "Suno",
    icon: "🎵",
    category: "audio-music",
    subcategory: "Music Generation",
    color: "#ec4899",
    summary: "AI music generation from text prompts. Full songs with vocals, instruments, lyrics. V4 with studio-quality output.",
    tags: ["Music", "Songs", "Vocals", "V4"],
    links: ["https://suno.com/blog"],
    subProducts: [],
    timeline: [
      { date: "2023", description: "Suno launched", type: "launch" },
      { date: "2024", description: "V3 with extended songs", type: "launch" },
      { date: "2025", description: "V4 studio-quality, covers feature", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "udio",
    title: "Udio",
    icon: "🎶",
    category: "audio-music",
    subcategory: "Music Generation",
    color: "#ec4899",
    summary: "AI song creation with fine-grained style control. Multi-genre, lyrics-first workflow. Competing directly with Suno.",
    tags: ["Music", "Style Control", "Lyrics", "Multi-genre"],
    links: ["https://www.udio.com/blog"],
    subProducts: [],
    timeline: [
      { date: "2024-04", description: "Udio launched", type: "launch" },
      { date: "2025", description: "V2 with improved quality", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "whisper",
    title: "Whisper (OpenAI)",
    icon: "🗣️",
    category: "audio-music",
    subcategory: "Speech-to-Text",
    color: "#ec4899",
    summary: "OpenAI's open-source speech recognition. 99 languages. Runs locally. Industry standard for transcription. Free.",
    tags: ["Open Source", "99 Languages", "Free", "Transcription"],
    links: ["https://platform.openai.com/docs/guides/speech-to-text", "https://github.com/openai/whisper"],
    subProducts: [],
    timeline: [
      { date: "2022-09", description: "Whisper open-sourced", type: "launch" },
      { date: "2024", description: "Large V3 Turbo — faster, more accurate", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "descript",
    title: "Descript",
    icon: "✂️",
    category: "audio-music",
    subcategory: "Audio/Video Editor",
    color: "#ec4899",
    summary: "Edit audio/video like a text document. AI transcription, filler word removal, voice cloning, screen recording.",
    tags: ["Editor", "Podcast", "Transcription", "Filler Removal"],
    links: ["https://www.descript.com/blog", "https://help.descript.com/"],
    subProducts: [
      { name: "Overdub", icon: "🎤", description: "AI voice cloning for corrections" },
      { name: "Studio Sound", icon: "🔇", description: "Remove background noise, enhance voice" },
    ],
    timeline: [
      { date: "2019", description: "Descript launched", type: "launch" },
      { date: "2024", description: "AI-powered editing suite, Overdub v2", type: "update" },
      { date: "2025", description: "AI video editing, auto-captions", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "murf-ai",
    title: "Murf AI",
    icon: "📢",
    category: "audio-music",
    subcategory: "Voice Over",
    color: "#ec4899",
    summary: "AI voiceover platform. 200+ voices, 20 languages. Used for e-learning, marketing, audiobooks. Enterprise-grade.",
    tags: ["Voiceover", "200+ Voices", "E-learning", "Enterprise"],
    links: ["https://murf.ai/resources/blog"],
    subProducts: [],
    timeline: [
      { date: "2021", description: "Murf AI launched", type: "launch" },
      { date: "2025", description: "Enterprise features, API access", type: "update" },
    ],
    positionX: 0, positionY: 0,
  },

  // === AGENTS & INFRASTRUCTURE ===
  {
    id: "openclaw",
    title: "OpenClaw",
    icon: "🐾",
    category: "agents-infra",
    subcategory: "Personal Agent",
    color: "#f43f5e",
    summary: "Open-source autonomous agent. 234K+ GitHub stars. AI personal assistant: calendars, flights, task automation.",
    tags: ["Open Source", "234K Stars", "Personal Assistant", "Multi-channel"],
    links: ["https://github.com/openclaw"],
    subProducts: [],
    timeline: [
      { date: "2024", description: "Open-source release, rapid growth", type: "launch" },
      { date: "2026-02", description: "Creator Peter Steinberger joined OpenAI", type: "milestone" },
      { date: "2026", description: "Moving to open-source foundation", type: "update" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "moltbook",
    title: "Moltbook",
    icon: "📖",
    category: "agents-infra",
    subcategory: "Agent Forum",
    color: "#f43f5e",
    summary: "Internet forum exclusively for AI agents. Reddit-like. Claims 1.6M agents. 100% vibe-coded. Now considered overhyped.",
    tags: ["Agent Forum", "Vibe-coded", "Controversial", "MOLT Token"],
    links: [],
    subProducts: [],
    timeline: [
      { date: "2026-01", description: "Launched by Matt Schlicht", type: "launch" },
      { date: "2026-01", description: "MOLT token rallied 1,800% in 24 hours", type: "milestone" },
      { date: "2026-02", description: "Unsecured database vulnerability discovered", type: "update" },
      { date: "2026-02", description: "MIT Tech Review: 'peak AI theater'", type: "update" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "langchain",
    title: "LangChain / LangGraph",
    icon: "🔗",
    category: "agents-infra",
    subcategory: "Agent Framework",
    color: "#f43f5e",
    summary: "Most adopted agent framework. LangGraph 1.0 GA: production-grade agents, durable state, human-in-the-loop.",
    tags: ["Framework", "De Facto Standard", "Production", "HitL"],
    links: ["https://python.langchain.com/docs/", "https://langchain-ai.github.io/langgraph/"],
    subProducts: [
      { name: "LangGraph 1.0", icon: "📊", description: "Production-grade agents, durable state, human-in-the-loop API" },
    ],
    timeline: [
      { date: "2022-10", description: "LangChain launched", type: "launch" },
      { date: "2025", description: "LangGraph 1.0 GA", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "crewai",
    title: "CrewAI",
    icon: "👥",
    category: "agents-infra",
    subcategory: "Multi-Agent",
    color: "#f43f5e",
    summary: "Role-based multi-agent collaboration. Define agents as Researcher, Writer, Analyst. Human-in-the-loop.",
    tags: ["Multi-Agent", "Role-based", "Collaboration"],
    links: ["https://docs.crewai.com/"],
    subProducts: [],
    timeline: [
      { date: "2024", description: "CrewAI launched", type: "launch" },
      { date: "2026-02", description: "MCP tool resolution, Stagehand integration", type: "update" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "autogpt",
    title: "AutoGPT",
    icon: "🤖",
    category: "agents-infra",
    subcategory: "Autonomous Agent",
    color: "#f43f5e",
    summary: "Pioneered autonomous agents (Mar 2023). 167K+ GitHub stars. Goal-driven, minimal human intervention.",
    tags: ["Pioneer", "167K Stars", "Autonomous", "Goal-driven"],
    links: ["https://docs.agpt.co/", "https://github.com/Significant-Gravitas/AutoGPT"],
    subProducts: [],
    timeline: [
      { date: "2023-03", description: "Pioneered autonomous agents", type: "launch" },
      { date: "2026-02", description: "v0.6.49", type: "update" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "mcp-protocol",
    title: "MCP (Model Context Protocol)",
    icon: "🔌",
    category: "agents-infra",
    subcategory: "Open Protocol",
    color: "#f43f5e",
    summary: "Open standard by Anthropic that lets AI models connect to external tools, databases, and APIs through a universal interface. Think of it as a 'USB-C for AI' — one protocol to plug any tool into any model.",
    tags: ["Protocol", "Open Standard", "Anthropic", "Tool-Use", "Interoperability"],
    links: ["https://modelcontextprotocol.io/", "https://github.com/modelcontextprotocol"],
    subProducts: [
      { name: "MCP Servers", icon: "🖥️", description: "Pre-built connectors for GitHub, Slack, databases, file systems, and more" },
      { name: "MCP Clients", icon: "📱", description: "AI apps (Claude, Cursor, Windsurf) that can call any MCP server" },
      { name: "MCP Inspector", icon: "🔍", description: "Debug and test MCP servers during development" },
    ],
    timeline: [
      { date: "2024-11", description: "Anthropic open-sources MCP specification", type: "launch" },
      { date: "2025-03", description: "Adopted by Cursor, Windsurf, Replit, and others", type: "milestone" },
      { date: "2025-11", description: "OpenAI adds MCP support to ChatGPT desktop", type: "milestone" },
      { date: "2026-01", description: "Google, Microsoft adopt MCP; becomes de facto standard", type: "milestone" },
    ],
    positionX: 0, positionY: 0,
  },

  // === AUTOMATIONS ===
  {
    id: "zapier",
    title: "Zapier",
    icon: "⚡",
    category: "automations",
    subcategory: "Workflow Automation",
    color: "#f97316",
    summary: "The OG automation platform. 7,000+ app integrations. AI-powered Zaps with natural language setup.",
    tags: ["7000+ Apps", "No-code", "AI Zaps", "Popular"],
    links: ["https://platform.zapier.com/docs", "https://zapier.com/blog"],
    subProducts: [
      { name: "AI Zaps", icon: "🤖", description: "Build automations using natural language", releaseDate: "2024" },
      { name: "Central Tables", icon: "📊", description: "Built-in database for automation data" },
    ],
    timeline: [
      { date: "2012", description: "Founded", type: "launch" },
      { date: "2024", description: "AI-powered Zap builder", type: "launch" },
      { date: "2025", description: "Central Tables, Canvas", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "make",
    title: "Make.com",
    icon: "🔧",
    category: "automations",
    subcategory: "Visual Automation",
    color: "#f97316",
    summary: "Visual automation builder (formerly Integromat). Complex multi-step scenarios with branching, loops, and error handling.",
    tags: ["Visual Builder", "Complex Flows", "Branching", "1500+ Apps"],
    links: ["https://www.make.com/en/help", "https://www.make.com/en/blog"],
    subProducts: [],
    timeline: [
      { date: "2016", description: "Launched as Integromat", type: "launch" },
      { date: "2022", description: "Rebranded to Make", type: "update" },
      { date: "2025", description: "AI scenario builder", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "n8n",
    title: "n8n",
    icon: "🔄",
    category: "automations",
    subcategory: "Open Source Automation",
    color: "#f97316",
    summary: "Open-source workflow automation. Self-hostable. 500+ integrations. AI agents with human-in-the-loop approval.",
    tags: ["Open Source", "Self-hosted", "500+ Integrations", "HitL"],
    links: ["https://docs.n8n.io/", "https://blog.n8n.io/"],
    subProducts: [],
    timeline: [
      { date: "2019", description: "Founded, open-source release", type: "launch" },
      { date: "2025", description: "AI agent workflows", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },

  // === AI-POWERED APPS ===
  {
    id: "superhuman",
    title: "Superhuman",
    icon: "✉️",
    category: "ai-apps",
    subcategory: "AI Email",
    color: "#14b8a6",
    summary: "Fastest email client. AI auto-drafts, instant reply suggestions, smart scheduling. $30/mo.",
    tags: ["Email", "Productivity", "Speed", "$30/mo"],
    links: ["https://blog.superhuman.com/"],
    subProducts: [
      { name: "AI Auto-drafts", icon: "✍️", description: "AI writes complete email replies matching your tone" },
      { name: "Instant Reply", icon: "⚡", description: "One-click AI-generated responses" },
    ],
    timeline: [
      { date: "2017", description: "Founded", type: "launch" },
      { date: "2024", description: "AI features rollout", type: "launch" },
      { date: "2025", description: "Full AI auto-draft integration", type: "update" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "notion-ai",
    title: "Notion AI",
    icon: "📝",
    category: "ai-apps",
    subcategory: "AI Workspace",
    color: "#14b8a6",
    summary: "All-in-one workspace with AI. Summarize docs, generate content, auto-fill databases. Q&A across your entire workspace.",
    tags: ["Workspace", "Docs", "AI Q&A", "Databases"],
    links: ["https://www.notion.so/help", "https://www.notion.so/blog"],
    subProducts: [
      { name: "AI Q&A", icon: "💬", description: "Ask questions across your entire workspace" },
      { name: "AI Autofill", icon: "📊", description: "Auto-populate database properties with AI" },
    ],
    timeline: [
      { date: "2023-02", description: "Notion AI launched", type: "launch" },
      { date: "2025", description: "Connectors, AI Q&A across integrations", type: "update" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "perplexity",
    title: "Perplexity",
    icon: "🔍",
    category: "llm-chatbots",
    subcategory: "AI Search Engine",
    color: "#6366f1",
    summary: "AI-native search engine. Real-time citations. Pro Search with multi-step reasoning. Challenging Google's dominance.",
    tags: ["Search", "Citations", "Pro Search", "Google Rival"],
    links: ["https://docs.perplexity.ai/", "https://www.perplexity.ai/hub"],
    subProducts: [
      { name: "Pro Search", icon: "🔬", description: "Multi-step research with follow-up questions" },
      { name: "Pages", icon: "📄", description: "Turn research into shareable articles" },
    ],
    timeline: [
      { date: "2022", description: "Founded", type: "launch" },
      { date: "2024", description: "Rapid growth, $500M+ valuation", type: "funding" },
      { date: "2025", description: "Enterprise launch, API expansion", type: "launch" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "gamma",
    title: "Gamma",
    icon: "📊",
    category: "ai-apps",
    subcategory: "AI Presentations",
    color: "#14b8a6",
    summary: "AI presentation and document builder. Generate polished slides from text. Adaptive layouts, image generation.",
    tags: ["Presentations", "Slides", "No-design", "Analytics"],
    links: ["https://gamma.app/docs"],
    subProducts: [],
    timeline: [
      { date: "2023", description: "Gamma launched", type: "launch" },
      { date: "2025", description: "Image gen, analytics, templates", type: "update" },
    ],
    positionX: 0, positionY: 0,
  },
];

// Assign positions using a horizontal grid layout per category
{
  const centerX = 2500;
  const centerY = 2000;
  const leftCats = categories.filter(c => c.side === "left");
  const rightCats = categories.filter(c => c.side === "right");

  const cardW = 310;
  const cardH = 230;

  const categoryRadius = 2200;

  const catCenters: Record<string, { x: number; y: number }> = {};
  categories.forEach(cat => {
    let catAngle: number;
    if (cat.side === "left") {
      const idx = leftCats.findIndex(c => c.id === cat.id);
      catAngle = (130 + (idx + 1) * (160 / (leftCats.length + 1))) * (Math.PI / 180);
    } else {
      const idx = rightCats.findIndex(c => c.id === cat.id);
      catAngle = (-70 + (idx + 1) * (140 / (rightCats.length + 1))) * (Math.PI / 180);
    }
    catCenters[cat.id] = {
      x: centerX + Math.cos(catAngle) * categoryRadius,
      y: centerY + Math.sin(catAngle) * categoryRadius,
    };
  });

  // Group cards by category and assign HORIZONTAL grid positions
  const cardsByCategory: Record<string, typeof defaultCards> = {};
  defaultCards.forEach(card => {
    if (!cardsByCategory[card.category]) cardsByCategory[card.category] = [];
    cardsByCategory[card.category].push(card);
  });

  Object.entries(cardsByCategory).forEach(([catId, cards]) => {
    const center = catCenters[catId];
    if (!center) return;
    const totalCards = cards.length;
    // Use more columns for horizontal spread (3-5 cols depending on count)
    const gridCols = Math.min(Math.max(3, Math.ceil(totalCards / 2)), 5);
    const gridRows = Math.ceil(totalCards / gridCols);
    const startX = center.x - (gridCols * cardW) / 2;
    const startY = center.y - (gridRows * cardH) / 2;

    cards.forEach((card, i) => {
      const col = i % gridCols;
      const row = Math.floor(i / gridCols);
      card.positionX = startX + col * cardW;
      card.positionY = startY + row * cardH;
    });
  });
}
