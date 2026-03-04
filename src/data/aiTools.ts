export type AITool = {
  name: string;
  url?: string;
  description?: string;
};

export type AICategory = {
  id: string;
  label: string;
  color: "cyan" | "purple" | "amber" | "rose" | "green" | "blue";
  icon: string;
  tools: AITool[];
};

export const aiCategories: AICategory[] = [
  {
    id: "llms",
    label: "LLMs",
    color: "cyan",
    icon: "🧠",
    tools: [
      { name: "GPT-5", description: "OpenAI's latest flagship model" },
      { name: "Claude 4", description: "Anthropic's advanced reasoning model" },
      { name: "Gemini 2.5 Pro", description: "Google DeepMind multimodal LLM" },
      { name: "Llama 4", description: "Meta's open-source LLM" },
      { name: "Mistral Large", description: "European open-weight LLM" },
      { name: "Grok", description: "xAI's conversational model" },
      { name: "Command R+", description: "Cohere's enterprise LLM" },
      { name: "DeepSeek V3", description: "DeepSeek's reasoning model" },
    ],
  },
  {
    id: "agentic",
    label: "Agentic Platforms",
    color: "purple",
    icon: "🤖",
    tools: [
      { name: "AutoGPT", description: "Autonomous AI agent framework" },
      { name: "CrewAI", description: "Multi-agent orchestration" },
      { name: "LangChain", description: "LLM application framework" },
      { name: "LangGraph", description: "Stateful agent workflows" },
      { name: "OpenAI Agents SDK", description: "OpenAI's agent toolkit" },
      { name: "Devin", description: "AI software engineer" },
      { name: "Cursor", description: "AI-powered code editor" },
      { name: "Lovable", description: "AI full-stack app builder" },
    ],
  },
  {
    id: "image",
    label: "Image Generation",
    color: "amber",
    icon: "🎨",
    tools: [
      { name: "DALL·E 3", description: "OpenAI image generation" },
      { name: "Midjourney V7", description: "Artistic image generation" },
      { name: "Stable Diffusion 3", description: "Open-source image gen" },
      { name: "Flux", description: "Black Forest Labs models" },
      { name: "Adobe Firefly", description: "Adobe's creative AI" },
      { name: "Ideogram", description: "Text-in-image specialist" },
      { name: "Leonardo AI", description: "Game asset generation" },
    ],
  },
  {
    id: "video",
    label: "Video Generation",
    color: "rose",
    icon: "🎬",
    tools: [
      { name: "Sora", description: "OpenAI video generation" },
      { name: "Runway Gen-3", description: "Professional video AI" },
      { name: "Pika Labs", description: "Creative video generation" },
      { name: "Kling AI", description: "Kuaishou video model" },
      { name: "Luma Dream Machine", description: "3D-aware video gen" },
      { name: "Veo 2", description: "Google DeepMind video" },
      { name: "HailuoAI", description: "MiniMax video model" },
    ],
  },
  {
    id: "opensource",
    label: "Open Source / OpenClaw",
    color: "green",
    icon: "🔓",
    tools: [
      { name: "Hugging Face", description: "ML model hub & community" },
      { name: "Ollama", description: "Run LLMs locally" },
      { name: "LM Studio", description: "Local model playground" },
      { name: "vLLM", description: "High-throughput serving" },
      { name: "Jan", description: "Offline AI assistant" },
      { name: "Open WebUI", description: "Self-hosted chat interface" },
      { name: "LocalAI", description: "Local OpenAI-compatible API" },
    ],
  },
  {
    id: "audio",
    label: "Audio & Music",
    color: "blue",
    icon: "🎵",
    tools: [
      { name: "ElevenLabs", description: "Voice cloning & TTS" },
      { name: "Suno", description: "AI music generation" },
      { name: "Udio", description: "AI song creation" },
      { name: "Whisper", description: "OpenAI speech-to-text" },
      { name: "Bark", description: "Open-source TTS" },
      { name: "Mubert", description: "AI background music" },
    ],
  },
];
