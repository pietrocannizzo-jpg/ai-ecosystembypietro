
-- Seed sub_products from hardcoded data
INSERT INTO public.sub_products (card_id, name, icon, description, release_date, sort_order) VALUES
-- ChatGPT
((SELECT id FROM public.cards WHERE slug = 'chatgpt-openai'), 'Sora 2', '🎬', 'Video generation — cinematic quality, realistic physics, synchronized dialogue & sound', '2025', 0),
((SELECT id FROM public.cards WHERE slug = 'chatgpt-openai'), 'GPT Image 1.5', '🎨', 'Replaced DALL-E. #1 on LM Arena image leaderboard', '2025', 1),
((SELECT id FROM public.cards WHERE slug = 'chatgpt-openai'), 'GPT-5.3-Codex', '💻', 'Agentic coding model. Strongest code generation', '2025', 2),
((SELECT id FROM public.cards WHERE slug = 'chatgpt-openai'), 'Canvas', '🖊️', 'Collaborative editing workspace within ChatGPT', '2024', 3),
((SELECT id FROM public.cards WHERE slug = 'chatgpt-openai'), 'Prism', '🔬', 'Research workspace for deep analysis', '2025', 4),
((SELECT id FROM public.cards WHERE slug = 'chatgpt-openai'), 'Operator', '🤖', 'AI agent that browses and acts on the web. 256K context', '2025', 5),
((SELECT id FROM public.cards WHERE slug = 'chatgpt-openai'), 'Custom GPTs', '🛍️', 'Marketplace of user-created specialized bots', '2023', 6),
((SELECT id FROM public.cards WHERE slug = 'chatgpt-openai'), 'ChatGPT Search', '🔍', 'Web search replacing Google for many users', '2024', 7),
((SELECT id FROM public.cards WHERE slug = 'chatgpt-openai'), 'Projects', '📁', 'Living sources — unified context from Slack, Drive, notes', '2026', 8),
-- Claude
((SELECT id FROM public.cards WHERE slug = 'claude-anthropic'), 'Claude Code', '💻', 'CLI agentic coding tool. Subagents, parallel execution, worktrees', '2025-05', 0),
((SELECT id FROM public.cards WHERE slug = 'claude-anthropic'), 'MCP', '🔌', '''USB-C of AI'' — open standard connecting any AI to any tool', '2024-11', 1),
((SELECT id FROM public.cards WHERE slug = 'claude-anthropic'), 'Computer Use', '🖥️', 'First AI to control desktop natively. 72.7% OSWorld benchmark', '2024-10', 2),
((SELECT id FROM public.cards WHERE slug = 'claude-anthropic'), 'Cowork', '🤝', 'Desktop automation for non-developers', '2026-01', 3),
((SELECT id FROM public.cards WHERE slug = 'claude-anthropic'), 'Artifacts', '📎', 'Live code/document previews in conversation (industry first)', '2024-06', 4),
((SELECT id FROM public.cards WHERE slug = 'claude-anthropic'), 'Chrome Extension', '🌐', 'Browser copilot', '2025-08', 5),
((SELECT id FROM public.cards WHERE slug = 'claude-anthropic'), 'Skills', '⚡', 'Teachable custom behaviors & scheduled tasks', '2025-10', 6),
((SELECT id FROM public.cards WHERE slug = 'claude-anthropic'), 'Extended Thinking', '🧠', 'Visible chain-of-thought reasoning', '2025', 7),
((SELECT id FROM public.cards WHERE slug = 'claude-anthropic'), 'Remote Phone Access', '📱', 'Control Claude from phone to desktop', '2026-03', 8),
-- Gemini
((SELECT id FROM public.cards WHERE slug = 'gemini-google'), 'Veo 3.1', '🎬', 'Video generation — native 4K, 1+ min coherent videos', '2025', 0),
((SELECT id FROM public.cards WHERE slug = 'gemini-google'), 'Gemini CLI', '💻', 'Terminal coding tool', '2025', 1),
((SELECT id FROM public.cards WHERE slug = 'gemini-google'), 'Gemini Live', '🎙️', 'Real-time voice conversations', '2024', 2),
((SELECT id FROM public.cards WHERE slug = 'gemini-google'), 'NotebookLM', '📓', 'AI-powered notebook for research', '2024', 3),
((SELECT id FROM public.cards WHERE slug = 'gemini-google'), 'Jules', '🤖', 'Autonomous coding agent — 73% task completion', '2026', 4),
((SELECT id FROM public.cards WHERE slug = 'gemini-google'), 'Gemini 3 Flash', '⚡', 'Pro reasoning + Flash speed for agentic workflows', '2026', 5),
-- DeepSeek
((SELECT id FROM public.cards WHERE slug = 'deepseek'), 'DeepSeek V3.2', '🧠', 'Unified model — both chat AND reasoning at same price', NULL, 0),
((SELECT id FROM public.cards WHERE slug = 'deepseek'), 'R1', '💭', 'Reasoning model, multiple sizes (1.5B to 70B)', NULL, 1),
-- Meta Llama
((SELECT id FROM public.cards WHERE slug = 'meta-llama'), 'Llama 4 Scout', '🔍', '17B params, 16 experts', NULL, 0),
((SELECT id FROM public.cards WHERE slug = 'meta-llama'), 'Llama 4 Maverick', '🚀', '17B latest model', NULL, 1),
((SELECT id FROM public.cards WHERE slug = 'meta-llama'), 'Llama 3.1 405B', '💪', 'First open source to rival closed-source', NULL, 2),
-- Mistral
((SELECT id FROM public.cards WHERE slug = 'mistral'), 'Mistral Large 2', '🧠', 'Flagship 123B model, strong coding & reasoning', NULL, 0),
((SELECT id FROM public.cards WHERE slug = 'mistral'), 'Le Chat', '💬', 'Consumer AI assistant with web search & canvas', NULL, 1),
((SELECT id FROM public.cards WHERE slug = 'mistral'), 'Codestral', '💻', 'Dedicated coding model, 32K context', NULL, 2),
-- Cohere
((SELECT id FROM public.cards WHERE slug = 'cohere'), 'Command R+', '🧠', 'Enterprise RAG-optimized model, 128K context', NULL, 0),
((SELECT id FROM public.cards WHERE slug = 'cohere'), 'Embed v3', '📐', 'Best-in-class multilingual embeddings', NULL, 1),
((SELECT id FROM public.cards WHERE slug = 'cohere'), 'Rerank 3', '🔍', 'Search result reranking model', NULL, 2),
-- Microsoft Copilot
((SELECT id FROM public.cards WHERE slug = 'microsoft-copilot'), 'Copilot in Word', '📝', 'Draft, rewrite, summarize documents', NULL, 0),
((SELECT id FROM public.cards WHERE slug = 'microsoft-copilot'), 'Copilot in Excel', '📊', 'Analyze data, create formulas, generate insights', NULL, 1),
((SELECT id FROM public.cards WHERE slug = 'microsoft-copilot'), 'Copilot in Teams', '👥', 'Meeting summaries, action items, chat recaps', NULL, 2),
-- Cursor
((SELECT id FROM public.cards WHERE slug = 'cursor'), 'Composer 1.5', '🎼', 'Multi-file agent mode with subagents', NULL, 0),
((SELECT id FROM public.cards WHERE slug = 'cursor'), 'Long-running Agents', '🤖', 'Background autonomous coding tasks', NULL, 1),
-- Windsurf
((SELECT id FROM public.cards WHERE slug = 'windsurf'), 'Arena Mode', '⚔️', 'Side-by-side model comparison', NULL, 0),
((SELECT id FROM public.cards WHERE slug = 'windsurf'), 'Plan Mode', '📋', 'Task planning before execution', NULL, 1),
-- GitHub Copilot
((SELECT id FROM public.cards WHERE slug = 'github-copilot'), 'Agent Mode', '🤖', 'Determines files to change, iterates to fix', NULL, 0),
((SELECT id FROM public.cards WHERE slug = 'github-copilot'), 'Copilot Workspace', '🏗️', 'Issue-to-PR workflow, async execution', NULL, 1),
((SELECT id FROM public.cards WHERE slug = 'github-copilot'), 'Coding Agent', '⚡', 'GA since Sep 2025, sub-agent architecture', NULL, 2),
-- Flux
((SELECT id FROM public.cards WHERE slug = 'flux'), 'FLUX Pro', '⭐', 'Highest quality', NULL, 0),
((SELECT id FROM public.cards WHERE slug = 'flux'), 'FLUX Klein', '⚡', 'Fastest image models (Jan 2026)', NULL, 1),
-- Adobe Firefly
((SELECT id FROM public.cards WHERE slug = 'adobe-firefly'), 'Generative Fill', '🖌️', 'AI fill/extend in Photoshop', NULL, 0),
((SELECT id FROM public.cards WHERE slug = 'adobe-firefly'), 'Text Effects', '✨', 'Stylized text generation', NULL, 1),
-- Veo
((SELECT id FROM public.cards WHERE slug = 'veo'), 'Veo 3.1', '🎬', 'Native 4K, 1+ min coherent video generation', '2025', 0),
-- ElevenLabs
((SELECT id FROM public.cards WHERE slug = 'elevenlabs'), 'Voice Cloning', '🎤', 'Clone any voice from minutes of audio', NULL, 0),
((SELECT id FROM public.cards WHERE slug = 'elevenlabs'), 'Dubbing', '🌐', 'Automatic video dubbing in 29 languages', NULL, 1),
((SELECT id FROM public.cards WHERE slug = 'elevenlabs'), 'Sound Effects', '🔊', 'AI-generated sound effects from text', NULL, 2),
-- Descript
((SELECT id FROM public.cards WHERE slug = 'descript'), 'Overdub', '🎤', 'AI voice cloning for corrections', NULL, 0),
((SELECT id FROM public.cards WHERE slug = 'descript'), 'Studio Sound', '🔇', 'Remove background noise, enhance voice', NULL, 1),
-- MCP Protocol
((SELECT id FROM public.cards WHERE slug = 'mcp-protocol'), 'MCP Servers', '🖥️', 'Pre-built connectors for GitHub, Slack, databases, file systems, and more', NULL, 0),
((SELECT id FROM public.cards WHERE slug = 'mcp-protocol'), 'MCP Clients', '📱', 'AI apps (Claude, Cursor, Windsurf) that can call any MCP server', NULL, 1),
((SELECT id FROM public.cards WHERE slug = 'mcp-protocol'), 'MCP Inspector', '🔍', 'Debug and test MCP servers during development', NULL, 2),
-- LangChain
((SELECT id FROM public.cards WHERE slug = 'langchain'), 'LangGraph 1.0', '📊', 'Production-grade agents, durable state, human-in-the-loop API', NULL, 0),
-- Zapier
((SELECT id FROM public.cards WHERE slug = 'zapier'), 'AI Zaps', '🤖', 'Build automations using natural language', '2024', 0),
((SELECT id FROM public.cards WHERE slug = 'zapier'), 'Central Tables', '📊', 'Built-in database for automation data', NULL, 1),
-- Superhuman
((SELECT id FROM public.cards WHERE slug = 'superhuman'), 'AI Auto-drafts', '✍️', 'AI writes complete email replies matching your tone', NULL, 0),
((SELECT id FROM public.cards WHERE slug = 'superhuman'), 'Instant Reply', '⚡', 'One-click AI-generated responses', NULL, 1),
-- Notion AI
((SELECT id FROM public.cards WHERE slug = 'notion-ai'), 'AI Q&A', '💬', 'Ask questions across your entire workspace', NULL, 0),
((SELECT id FROM public.cards WHERE slug = 'notion-ai'), 'AI Autofill', '📊', 'Auto-populate database properties with AI', NULL, 1),
-- Perplexity
((SELECT id FROM public.cards WHERE slug = 'perplexity'), 'Pro Search', '🔬', 'Multi-step research with follow-up questions', NULL, 0),
((SELECT id FROM public.cards WHERE slug = 'perplexity'), 'Pages', '📄', 'Turn research into shareable articles', NULL, 1);

-- Seed timeline_entries from hardcoded data
INSERT INTO public.timeline_entries (card_id, date, description, entry_type, sort_order) VALUES
-- ChatGPT
((SELECT id FROM public.cards WHERE slug = 'chatgpt-openai'), '2022-11', 'GPT-3.5 / ChatGPT launch', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'chatgpt-openai'), '2023-03', 'GPT-4 released', 'launch', 1),
((SELECT id FROM public.cards WHERE slug = 'chatgpt-openai'), '2023-11', 'Custom GPTs marketplace', 'launch', 2),
((SELECT id FROM public.cards WHERE slug = 'chatgpt-openai'), '2024-05', 'GPT-4o multimodal', 'launch', 3),
((SELECT id FROM public.cards WHERE slug = 'chatgpt-openai'), '2024-09', 'o1 reasoning model', 'launch', 4),
((SELECT id FROM public.cards WHERE slug = 'chatgpt-openai'), '2024-10', 'Canvas collaborative editing', 'launch', 5),
((SELECT id FROM public.cards WHERE slug = 'chatgpt-openai'), '2024-12', 'ChatGPT Search', 'launch', 6),
((SELECT id FROM public.cards WHERE slug = 'chatgpt-openai'), '2025-01', 'Operator AI agent', 'launch', 7),
((SELECT id FROM public.cards WHERE slug = 'chatgpt-openai'), '2025-03', 'GPT-5 released', 'launch', 8),
((SELECT id FROM public.cards WHERE slug = 'chatgpt-openai'), '2025-06', 'Sora 2 video generation', 'launch', 9),
((SELECT id FROM public.cards WHERE slug = 'chatgpt-openai'), '2025-08', 'GPT Image 1.5', 'launch', 10),
((SELECT id FROM public.cards WHERE slug = 'chatgpt-openai'), '2025-10', 'GPT-5.3-Codex', 'launch', 11),
((SELECT id FROM public.cards WHERE slug = 'chatgpt-openai'), '2026-01', 'Prism research workspace', 'launch', 12),
((SELECT id FROM public.cards WHERE slug = 'chatgpt-openai'), '2026-02', 'Projects with living sources', 'launch', 13),
-- Claude
((SELECT id FROM public.cards WHERE slug = 'claude-anthropic'), '2023-03', 'Claude 1.0 launched', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'claude-anthropic'), '2023-07', 'Claude 2 (100K context)', 'launch', 1),
((SELECT id FROM public.cards WHERE slug = 'claude-anthropic'), '2024-03', 'Claude 3 family (Opus, Sonnet, Haiku)', 'launch', 2),
((SELECT id FROM public.cards WHERE slug = 'claude-anthropic'), '2024-06', 'Artifacts — live code previews (industry first)', 'launch', 3),
((SELECT id FROM public.cards WHERE slug = 'claude-anthropic'), '2024-10', 'Computer Use — first AI desktop control', 'launch', 4),
((SELECT id FROM public.cards WHERE slug = 'claude-anthropic'), '2024-11', 'MCP open standard launched', 'launch', 5),
((SELECT id FROM public.cards WHERE slug = 'claude-anthropic'), '2025-05', 'Claude Code GA', 'launch', 6),
((SELECT id FROM public.cards WHERE slug = 'claude-anthropic'), '2025-08', 'Chrome Extension', 'launch', 7),
((SELECT id FROM public.cards WHERE slug = 'claude-anthropic'), '2025-10', 'Skills — teachable behaviors', 'launch', 8),
((SELECT id FROM public.cards WHERE slug = 'claude-anthropic'), '2025-11', '1M context window', 'milestone', 9),
((SELECT id FROM public.cards WHERE slug = 'claude-anthropic'), '2026-01', 'Cowork desktop automation', 'launch', 10),
((SELECT id FROM public.cards WHERE slug = 'claude-anthropic'), '2026-02', 'Opus 4.6 — most capable model', 'launch', 11),
((SELECT id FROM public.cards WHERE slug = 'claude-anthropic'), '2026-03', 'Remote Phone Access', 'launch', 12),
-- Gemini
((SELECT id FROM public.cards WHERE slug = 'gemini-google'), '2023-12', 'Gemini 1.0 launched', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'gemini-google'), '2024-02', '1.5 Pro — first 1M context', 'launch', 1),
((SELECT id FROM public.cards WHERE slug = 'gemini-google'), '2024-06', 'Workspace integration', 'launch', 2),
((SELECT id FROM public.cards WHERE slug = 'gemini-google'), '2024-09', 'Gemini Live voice', 'launch', 3),
((SELECT id FROM public.cards WHERE slug = 'gemini-google'), '2025-02', '2.0 Flash', 'launch', 4),
((SELECT id FROM public.cards WHERE slug = 'gemini-google'), '2025-06', 'CLI tool', 'launch', 5),
((SELECT id FROM public.cards WHERE slug = 'gemini-google'), '2025-09', 'Veo 3.1 video', 'launch', 6),
((SELECT id FROM public.cards WHERE slug = 'gemini-google'), '2026-01', '3.1 Pro, Jules, 3 Flash', 'launch', 7),
((SELECT id FROM public.cards WHERE slug = 'gemini-google'), '2026', 'Replacing Google Assistant', 'update', 8),
-- DeepSeek
((SELECT id FROM public.cards WHERE slug = 'deepseek'), '2023', 'Founded', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'deepseek'), '2024', 'V2 released', 'launch', 1),
((SELECT id FROM public.cards WHERE slug = 'deepseek'), '2025-01', 'R1 matched o1 at fraction of cost (caused Nvidia stock crash)', 'launch', 2),
((SELECT id FROM public.cards WHERE slug = 'deepseek'), '2025', 'V3.1', 'update', 3),
((SELECT id FROM public.cards WHERE slug = 'deepseek'), '2026', 'V3.2 unified model', 'launch', 4),
-- Grok
((SELECT id FROM public.cards WHERE slug = 'grok-xai'), '2023-11', 'Grok-1 launched', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'grok-xai'), '2024-03', 'Grok-1 open-sourced', 'milestone', 1),
((SELECT id FROM public.cards WHERE slug = 'grok-xai'), '2026-03', 'Grok 4.20 Beta 2 — multi-agent system', 'launch', 2),
-- Meta Llama
((SELECT id FROM public.cards WHERE slug = 'meta-llama'), '2023-02', 'Llama 1 released', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'meta-llama'), '2023-07', 'Llama 2 open source', 'launch', 1),
((SELECT id FROM public.cards WHERE slug = 'meta-llama'), '2024-04', 'Llama 3 models', 'launch', 2),
((SELECT id FROM public.cards WHERE slug = 'meta-llama'), '2024-07', 'Llama 3.1 405B', 'launch', 3),
((SELECT id FROM public.cards WHERE slug = 'meta-llama'), '2024-09', 'Llama 3.2 multimodal', 'launch', 4),
((SELECT id FROM public.cards WHERE slug = 'meta-llama'), '2025', 'Llama 4 Scout & Maverick', 'launch', 5),
-- Mistral
((SELECT id FROM public.cards WHERE slug = 'mistral'), '2023-09', 'Mistral 7B — strongest open 7B model', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'mistral'), '2024-02', 'Mistral Large launched', 'launch', 1),
((SELECT id FROM public.cards WHERE slug = 'mistral'), '2024-07', 'Mistral Large 2 (123B params)', 'launch', 2),
((SELECT id FROM public.cards WHERE slug = 'mistral'), '2025', 'Le Chat consumer app, Codestral', 'launch', 3),
-- Cohere
((SELECT id FROM public.cards WHERE slug = 'cohere'), '2022', 'Founded, early API access', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'cohere'), '2024-04', 'Command R+ launched', 'launch', 1),
((SELECT id FROM public.cards WHERE slug = 'cohere'), '2025', 'Enterprise RAG suite, private cloud', 'launch', 2),
-- Microsoft Copilot
((SELECT id FROM public.cards WHERE slug = 'microsoft-copilot'), '2023-03', 'Microsoft 365 Copilot announced', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'microsoft-copilot'), '2023-11', 'Enterprise GA at $30/user/mo', 'launch', 1),
((SELECT id FROM public.cards WHERE slug = 'microsoft-copilot'), '2025', 'Copilot Vision, Copilot Actions', 'launch', 2),
-- Cursor
((SELECT id FROM public.cards WHERE slug = 'cursor'), '2023', 'Cursor IDE launched', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'cursor'), '2026-02', 'Cursor 2.5 with long-running agents, Composer 1.5', 'launch', 1),
-- Windsurf
((SELECT id FROM public.cards WHERE slug = 'windsurf'), '2025-12', 'Cognition AI acquisition ~$250M', 'funding', 0),
((SELECT id FROM public.cards WHERE slug = 'windsurf'), '2026', 'Plans to merge with Devin', 'update', 1),
-- GitHub Copilot
((SELECT id FROM public.cards WHERE slug = 'github-copilot'), '2021-06', 'GitHub Copilot preview', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'github-copilot'), '2025-09', 'Coding Agent GA', 'launch', 1),
((SELECT id FROM public.cards WHERE slug = 'github-copilot'), '2026', 'Agent Mode across all IDEs + MCP integration', 'update', 2),
-- Lovable
((SELECT id FROM public.cards WHERE slug = 'lovable'), '2024', 'Founded, rapid growth', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'lovable'), '2025', '$100M ARR in 8 months', 'milestone', 1),
-- v0
((SELECT id FROM public.cards WHERE slug = 'v0-vercel'), '2023-10', 'v0 launched', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'v0-vercel'), '2026-02', 'Major overhaul: Git integration, VS Code editor', 'update', 1),
-- Replit
((SELECT id FROM public.cards WHERE slug = 'replit'), '2026-03', 'Plan changes: Teams → Pro, Core $20/mo', 'update', 0),
-- Claude Code
((SELECT id FROM public.cards WHERE slug = 'claude-code'), '2025-02', 'Claude Code preview', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'claude-code'), '2025-05', 'General availability', 'launch', 1),
((SELECT id FROM public.cards WHERE slug = 'claude-code'), '2025-12', 'Open-sourced on GitHub', 'milestone', 2),
-- Tabnine
((SELECT id FROM public.cards WHERE slug = 'tabnine'), '2018', 'Founded (originally Codota)', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'tabnine'), '2025', 'Enterprise focus, private deployment', 'update', 1),
-- Amazon Q
((SELECT id FROM public.cards WHERE slug = 'amazon-q'), '2023-11', 'Launched as Amazon CodeWhisperer', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'amazon-q'), '2024-04', 'Rebranded to Amazon Q Developer', 'update', 1),
((SELECT id FROM public.cards WHERE slug = 'amazon-q'), '2025', 'Agent capabilities, /transform command', 'launch', 2),
-- Midjourney
((SELECT id FROM public.cards WHERE slug = 'midjourney'), '2022-07', 'V1 launched via Discord', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'midjourney'), '2024', 'V6 with major quality improvements', 'launch', 1),
((SELECT id FROM public.cards WHERE slug = 'midjourney'), '2025', 'Video generation added', 'launch', 2),
((SELECT id FROM public.cards WHERE slug = 'midjourney'), '2026-04', 'V7 alpha expected', 'update', 3),
-- Flux
((SELECT id FROM public.cards WHERE slug = 'flux'), '2024-08', 'FLUX.1 launched', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'flux'), '2025-11', 'FLUX.2', 'launch', 1),
((SELECT id FROM public.cards WHERE slug = 'flux'), '2026-01', 'Klein — fastest models', 'launch', 2),
-- Stable Diffusion
((SELECT id FROM public.cards WHERE slug = 'stable-diffusion'), '2022-08', 'SD 1.0 launched', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'stable-diffusion'), '2025', 'SD 3.5 family (Large, Turbo, Medium)', 'launch', 1),
-- Ideogram
((SELECT id FROM public.cards WHERE slug = 'ideogram'), '2023', 'Founded, V1', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'ideogram'), '2025', 'V3 with batch generation', 'launch', 1),
-- DALL-E
((SELECT id FROM public.cards WHERE slug = 'dalle'), '2021-01', 'DALL·E 1 announced', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'dalle'), '2022-04', 'DALL·E 2 with inpainting', 'launch', 1),
((SELECT id FROM public.cards WHERE slug = 'dalle'), '2023-10', 'DALL·E 3 in ChatGPT', 'launch', 2),
((SELECT id FROM public.cards WHERE slug = 'dalle'), '2025', 'Superseded by GPT Image 1.5', 'update', 3),
-- Leonardo AI
((SELECT id FROM public.cards WHERE slug = 'leonardo-ai'), '2023', 'Leonardo AI launched', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'leonardo-ai'), '2024', 'Phoenix model, Motion feature', 'launch', 1),
((SELECT id FROM public.cards WHERE slug = 'leonardo-ai'), '2025', 'Real-time canvas, style transfer', 'update', 2),
-- Adobe Firefly
((SELECT id FROM public.cards WHERE slug = 'adobe-firefly'), '2023-03', 'Firefly beta launched', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'adobe-firefly'), '2023-09', 'GA in Creative Cloud', 'launch', 1),
((SELECT id FROM public.cards WHERE slug = 'adobe-firefly'), '2025', 'Firefly Image 3, video features', 'launch', 2),
-- Seedance
((SELECT id FROM public.cards WHERE slug = 'seedance'), '2026-02', '#1 on Artificial Analysis benchmark', 'milestone', 0),
((SELECT id FROM public.cards WHERE slug = 'seedance'), '2026-03', 'LumeFlow integration', 'update', 1),
-- Runway
((SELECT id FROM public.cards WHERE slug = 'runway'), '2023', 'Pioneer of AI video gen', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'runway'), '2025', 'Gen-4.5 with native audio', 'launch', 1),
-- Kling
((SELECT id FROM public.cards WHERE slug = 'kling'), '2025-12', 'First synchronized video+audio generation', 'milestone', 0),
-- Pika
((SELECT id FROM public.cards WHERE slug = 'pika'), '2023', 'Pika 1.0 launched', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'pika'), '2025', 'Pika 2.5 with physics-aware effects', 'launch', 1),
((SELECT id FROM public.cards WHERE slug = 'pika'), '2026', 'AI social video app (iOS early access)', 'launch', 2),
-- Veo
((SELECT id FROM public.cards WHERE slug = 'veo'), '2024-05', 'Veo announced at Google I/O', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'veo'), '2025', 'Veo 3.1 with native 4K', 'launch', 1),
-- Sora
((SELECT id FROM public.cards WHERE slug = 'sora'), '2024-02', 'Sora preview announced', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'sora'), '2024-12', 'Sora public launch', 'launch', 1),
((SELECT id FROM public.cards WHERE slug = 'sora'), '2025', 'Sora 2 with synchronized audio', 'launch', 2),
-- Luma
((SELECT id FROM public.cards WHERE slug = 'luma'), '2024-06', 'Dream Machine launched', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'luma'), '2025', 'Ray2 model with 3D understanding', 'launch', 1),
-- HailuoAI
((SELECT id FROM public.cards WHERE slug = 'hailuoai'), '2024', 'HailuoAI video launched', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'hailuoai'), '2025', 'Director model with camera control', 'launch', 1),
-- ElevenLabs
((SELECT id FROM public.cards WHERE slug = 'elevenlabs'), '2023', 'ElevenLabs launched', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'elevenlabs'), '2024', 'Voice cloning, dubbing, sound effects', 'launch', 1),
((SELECT id FROM public.cards WHERE slug = 'elevenlabs'), '2025-01', '$180M Series C at $3B valuation', 'funding', 2),
-- Suno
((SELECT id FROM public.cards WHERE slug = 'suno'), '2023', 'Suno launched', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'suno'), '2024', 'V3 with extended songs', 'launch', 1),
((SELECT id FROM public.cards WHERE slug = 'suno'), '2025', 'V4 studio-quality, covers feature', 'launch', 2),
-- Udio
((SELECT id FROM public.cards WHERE slug = 'udio'), '2024-04', 'Udio launched', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'udio'), '2025', 'V2 with improved quality', 'launch', 1),
-- Whisper
((SELECT id FROM public.cards WHERE slug = 'whisper'), '2022-09', 'Whisper open-sourced', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'whisper'), '2024', 'Large V3 Turbo — faster, more accurate', 'launch', 1),
-- Descript
((SELECT id FROM public.cards WHERE slug = 'descript'), '2019', 'Descript launched', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'descript'), '2024', 'AI-powered editing suite, Overdub v2', 'update', 1),
((SELECT id FROM public.cards WHERE slug = 'descript'), '2025', 'AI video editing, auto-captions', 'launch', 2),
-- Murf AI
((SELECT id FROM public.cards WHERE slug = 'murf-ai'), '2021', 'Murf AI launched', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'murf-ai'), '2025', 'Enterprise features, API access', 'update', 1),
-- OpenClaw
((SELECT id FROM public.cards WHERE slug = 'openclaw'), '2024', 'Open-source release, rapid growth', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'openclaw'), '2026-02', 'Creator Peter Steinberger joined OpenAI', 'milestone', 1),
((SELECT id FROM public.cards WHERE slug = 'openclaw'), '2026', 'Moving to open-source foundation', 'update', 2),
-- Moltbook
((SELECT id FROM public.cards WHERE slug = 'moltbook'), '2026-01', 'Launched by Matt Schlicht', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'moltbook'), '2026-01', 'MOLT token rallied 1,800% in 24 hours', 'milestone', 1),
((SELECT id FROM public.cards WHERE slug = 'moltbook'), '2026-02', 'Unsecured database vulnerability discovered', 'update', 2),
((SELECT id FROM public.cards WHERE slug = 'moltbook'), '2026-02', 'MIT Tech Review: ''peak AI theater''', 'update', 3),
-- LangChain
((SELECT id FROM public.cards WHERE slug = 'langchain'), '2022-10', 'LangChain launched', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'langchain'), '2025', 'LangGraph 1.0 GA', 'launch', 1),
-- CrewAI
((SELECT id FROM public.cards WHERE slug = 'crewai'), '2024', 'CrewAI launched', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'crewai'), '2026-02', 'MCP tool resolution, Stagehand integration', 'update', 1),
-- AutoGPT
((SELECT id FROM public.cards WHERE slug = 'autogpt'), '2023-03', 'Pioneered autonomous agents', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'autogpt'), '2026-02', 'v0.6.49', 'update', 1),
-- MCP Protocol
((SELECT id FROM public.cards WHERE slug = 'mcp-protocol'), '2024-11', 'Anthropic open-sources MCP specification', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'mcp-protocol'), '2025-03', 'Adopted by Cursor, Windsurf, Replit, and others', 'milestone', 1),
((SELECT id FROM public.cards WHERE slug = 'mcp-protocol'), '2025-11', 'OpenAI adds MCP support to ChatGPT desktop', 'milestone', 2),
((SELECT id FROM public.cards WHERE slug = 'mcp-protocol'), '2026-01', 'Google, Microsoft adopt MCP; becomes de facto standard', 'milestone', 3),
-- Zapier
((SELECT id FROM public.cards WHERE slug = 'zapier'), '2012', 'Founded', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'zapier'), '2024', 'AI-powered Zap builder', 'launch', 1),
((SELECT id FROM public.cards WHERE slug = 'zapier'), '2025', 'Central Tables, Canvas', 'launch', 2),
-- Make
((SELECT id FROM public.cards WHERE slug = 'make'), '2016', 'Launched as Integromat', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'make'), '2022', 'Rebranded to Make', 'update', 1),
((SELECT id FROM public.cards WHERE slug = 'make'), '2025', 'AI scenario builder', 'launch', 2),
-- n8n
((SELECT id FROM public.cards WHERE slug = 'n8n'), '2019', 'Founded, open-source release', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'n8n'), '2025', 'AI agent workflows', 'launch', 1),
-- Superhuman
((SELECT id FROM public.cards WHERE slug = 'superhuman'), '2017', 'Founded', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'superhuman'), '2024', 'AI features rollout', 'launch', 1),
((SELECT id FROM public.cards WHERE slug = 'superhuman'), '2025', 'Full AI auto-draft integration', 'update', 2),
-- Notion AI
((SELECT id FROM public.cards WHERE slug = 'notion-ai'), '2023-02', 'Notion AI launched', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'notion-ai'), '2025', 'Connectors, AI Q&A across integrations', 'update', 1),
-- Perplexity
((SELECT id FROM public.cards WHERE slug = 'perplexity'), '2022', 'Founded', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'perplexity'), '2024', 'Rapid growth, $500M+ valuation', 'funding', 1),
((SELECT id FROM public.cards WHERE slug = 'perplexity'), '2025', 'Enterprise launch, API expansion', 'launch', 2),
-- Gamma
((SELECT id FROM public.cards WHERE slug = 'gamma'), '2023', 'Gamma launched', 'launch', 0),
((SELECT id FROM public.cards WHERE slug = 'gamma'), '2025', 'Image gen, analytics, templates', 'update', 1);
