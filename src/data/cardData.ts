export interface SubProduct {
  name: string;
  icon: string;
  description: string;
  releaseDate?: string;
}

export interface TimelineEntry {
  date: string;
  description: string;
  type: "launch" | "update" | "funding" | "milestone";
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
  { id: "video-gen", label: "Video Generation", color: "#10b981", side: "right", description: "AI video creation tools producing cinema-grade footage from text and image prompts" },
  { id: "agents-infra", label: "Agents & Infrastructure", color: "#f43f5e", side: "right", description: "Autonomous AI agents, orchestration frameworks, and workflow automation platforms" },
  { id: "ai-market", label: "AI Market Overview", color: "#8b5cf6", side: "right", description: "Market trends, funding data, and competitive landscape analysis for the AI industry" },
];

// Helper to position cards radially around center
function generatePositions(categoryIndex: number, cardIndex: number, totalCards: number, side: "left" | "right"): { x: number; y: number } {
  const centerX = 2500;
  const centerY = 2000;
  const categoryRadius = 600;
  const cardRadius = 350;

  // Left side categories go from 120° to 240°, right side from -60° to 60°
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

  // Position cards around category center
  const cardAngle = ((cardIndex / Math.max(totalCards, 1)) * 2 * Math.PI) - Math.PI / 2;
  const x = catX + Math.cos(cardAngle) * cardRadius * (0.5 + (cardIndex % 3) * 0.3);
  const y = catY + Math.sin(cardAngle) * cardRadius * (0.5 + (cardIndex % 2) * 0.3);

  return { x, y };
}

export const defaultCards: CardData[] = [
  {
    id: "chatgpt-openai",
    title: "ChatGPT (OpenAI)",
    icon: "💬",
    category: "llm-chatbots",
    subcategory: "LLM Platform",
    color: "#6366f1",
    summary: "400M+ weekly users. ~64.5% market share. The dominant AI assistant with a vast ecosystem of sub-products.",
    tags: ["OpenAI", "GPT-5", "Market Leader", "400M Users"],
    links: [],
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
    summary: "Reasoning & coding leader. 77.2% SWE-bench. Most 'agentic' AI. Opus 4.6 with 1M context window.",
    tags: ["Anthropic", "Reasoning", "Coding", "MCP", "Agentic"],
    links: [],
    subProducts: [
      { name: "Claude Code", icon: "💻", description: "CLI agentic coding tool. Subagents, parallel execution, worktrees", releaseDate: "2025-05" },
      { name: "MCP", icon: "🔌", description: "'USB-C of AI' — open standard connecting any AI to any tool", releaseDate: "2024-11" },
      { name: "Computer Use", icon: "🖥️", description: "First AI to control desktop natively. 72.7% OSWorld benchmark", releaseDate: "2024-10" },
      { name: "Cowork", icon: "🤝", description: "Desktop automation for non-developers", releaseDate: "2026-01" },
      { name: "Artifacts", icon: "📎", description: "Live code/document previews in conversation (industry first)", releaseDate: "2024-06" },
      { name: "Chrome Extension", icon: "🌐", description: "Browser copilot", releaseDate: "2025-08" },
      { name: "Skills", icon: "⚡", description: "Teachable custom behaviors & scheduled tasks", releaseDate: "2025-10" },
      { name: "Extended Thinking", icon: "🧠", description: "Visible chain-of-thought reasoning", releaseDate: "2025" },
      { name: "Remote Phone Access", icon: "📱", description: "Control Claude from phone to desktop", releaseDate: "2026-03" },
    ],
    timeline: [
      { date: "2023-03", description: "Claude 1.0 launched", type: "launch" },
      { date: "2023-07", description: "Claude 2 (100K context)", type: "launch" },
      { date: "2024-03", description: "Claude 3 family (Opus, Sonnet, Haiku)", type: "launch" },
      { date: "2024-06", description: "Artifacts — live code previews (industry first)", type: "launch" },
      { date: "2024-10", description: "Computer Use — first AI desktop control", type: "launch" },
      { date: "2024-11", description: "MCP open standard launched", type: "launch" },
      { date: "2025-05", description: "Claude Code GA", type: "launch" },
      { date: "2025-08", description: "Chrome Extension", type: "launch" },
      { date: "2025-10", description: "Skills — teachable behaviors", type: "launch" },
      { date: "2025-11", description: "1M context window", type: "milestone" },
      { date: "2026-01", description: "Cowork desktop automation", type: "launch" },
      { date: "2026-02", description: "Opus 4.6 — most capable model", type: "launch" },
      { date: "2026-03", description: "Remote Phone Access", type: "launch" },
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
    links: [],
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
    summary: "Chinese, MIT open-source. ~3.7% share. Massive disruptor. V3.2 unified model at fraction of cost ($0.28/$0.42 per 1M tokens vs $60 for o1).",
    tags: ["Chinese", "Open Source", "MIT", "Cheap", "Disruptor"],
    links: [],
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
    links: [],
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
    links: [],
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
    links: [],
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
    summary: "By Cognition AI (acquired ~$250M). #1 LogRocket AI Dev Tool Rankings. Arena Mode, Plan Mode. Handles 1M+ line codebases.",
    tags: ["IDE", "Cognition", "Devin", "1M Lines"],
    links: [],
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
    summary: "Microsoft/GitHub. Enterprise standard. Agent Mode in VS Code, JetBrains, Eclipse, Xcode. Issue-to-PR workflow.",
    tags: ["Microsoft", "GitHub", "Enterprise", "Multi-IDE"],
    links: [],
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
    links: [],
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
    links: [],
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
    links: [],
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
    links: [],
    subProducts: [],
    timeline: [
      { date: "2026-03", description: "Plan changes: Teams → Pro, Core $20/mo", type: "update" },
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
    links: [],
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
    links: [],
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
    links: [],
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
    links: [],
    subProducts: [],
    timeline: [
      { date: "2023", description: "Founded, V1", type: "launch" },
      { date: "2025", description: "V3 with batch generation", type: "launch" },
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
    links: [],
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
    summary: "#1 on Artificial Analysis Text-to-Video (1,247 Elo). Native audio, long-form, multi-shot, character consistency.",
    tags: ["Professional", "#1 T2V", "Pioneer", "Multi-shot"],
    links: [],
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
    links: [],
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
    links: [],
    subProducts: [],
    timeline: [
      { date: "2023", description: "Pika 1.0 launched", type: "launch" },
      { date: "2025", description: "Pika 2.5 with physics-aware effects", type: "launch" },
      { date: "2026", description: "AI social video app (iOS early access)", type: "launch" },
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
    summary: "Open-source autonomous agent. 234K+ GitHub stars. AI personal assistant: calendars, flights, task automation. Multi-channel.",
    tags: ["Open Source", "234K Stars", "Personal Assistant", "Multi-channel"],
    links: [],
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
    summary: "Most adopted agent framework. LangGraph 1.0 GA: production-grade agents, durable state, human-in-the-loop. De facto standard.",
    tags: ["Framework", "De Facto Standard", "Production", "HitL"],
    links: [],
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
    links: [],
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
    links: [],
    subProducts: [],
    timeline: [
      { date: "2023-03", description: "Pioneered autonomous agents", type: "launch" },
      { date: "2026-02", description: "v0.6.49", type: "update" },
    ],
    positionX: 0, positionY: 0,
  },
  {
    id: "n8n",
    title: "n8n",
    icon: "🔄",
    category: "agents-infra",
    subcategory: "Workflow Automation",
    color: "#f43f5e",
    summary: "Workflow automation with AI agents. 500+ integrations. Human-in-the-loop approval before AI executes tools.",
    tags: ["Workflow", "500+ Integrations", "HitL", "Automation"],
    links: [],
    subProducts: [],
    timeline: [],
    positionX: 0, positionY: 0,
  },

  // === AI MARKET OVERVIEW ===
  {
    id: "ai-market-2026",
    title: "AI Market 2026",
    icon: "📊",
    category: "ai-market",
    subcategory: "Market Intelligence",
    color: "#8b5cf6",
    summary: "ChatGPT ~64.5%, Gemini ~21.5%, DeepSeek ~3.7%, Grok ~3.4%. Chatbots → agents transition, open source disruption, defence+AI convergence.",
    tags: ["Market Share", "Trends", "2026", "$49.1B Defence AI"],
    links: [],
    subProducts: [],
    timeline: [
      { date: "2025", description: "$49.1B raised in defence AI", type: "funding" },
      { date: "2026", description: "Chatbots → agents transition accelerating", type: "milestone" },
      { date: "2026", description: "MCP becoming universal standard", type: "milestone" },
      { date: "2026", description: "200K-1M context becoming baseline", type: "milestone" },
    ],
    positionX: 0, positionY: 0,
  },
];

// Assign positions using a grid layout per category to avoid overlaps
{
  const centerX = 2500;
  const centerY = 2000;
  const leftCats = categories.filter(c => c.side === "left");
  const rightCats = categories.filter(c => c.side === "right");

  const cardW = 310; // card width + gap
  const cardH = 230; // card height + gap
  const cols = 2;    // cards per row within a category

  // Calculate category center positions with more spread
  const categoryRadius = 1800;

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

  // Group cards by category and assign grid positions
  const catIndices: Record<string, number> = {};
  defaultCards.forEach(card => {
    if (!(card.category in catIndices)) catIndices[card.category] = 0;
    const idx = catIndices[card.category];
    const center = catCenters[card.category];
    if (!center) return;

    const cardsInCat = defaultCards.filter(c => c.category === card.category).length;
    const actualCols = Math.min(cols, cardsInCat);
    const row = Math.floor(idx / actualCols);
    const col = idx % actualCols;

    // Center the grid around the category center
    const gridW = actualCols * cardW;
    const gridH = Math.ceil(cardsInCat / actualCols) * cardH;

    card.positionX = center.x - gridW / 2 + col * cardW;
    card.positionY = center.y - gridH / 2 + row * cardH;

    catIndices[card.category]++;
  });
}
